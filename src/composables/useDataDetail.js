import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDateRange } from './userCommon' // 你自己的日期方法

import { aliasMap } from '../../static/config'

export function useXAixData() {
  let xAxisData = ref([])

  let updateXAxisData = (data) => {
    let result = []
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      result.push(element['date'])
    }
    xAxisData.value = result
  }

  return {
    xAxisData,
    updateXAxisData,
  }
}
export function useSeriesData() {
  const series = ref([])

  const updateSeriesData = (data) => {
    if (!data) return []

    // 初始化 series 数据结构
    const result = Object.keys(aliasMap).reduce((acc, key) => {
      acc[key] = {
        name: aliasMap[key],
        type: 'line',
        data: [],
        label: { show: true },
        emphasis: { focus: 'series' },
      }
      return acc
    }, {})

    // 填充数据
    data.forEach((element) => {
      Object.entries(element).forEach(([key, value]) => {
        if (result[key]) result[key].data.push(value)
      })
    })

    return Object.values(result)
  }

  return {
    series,
    updateSeriesData,
  }
}

export function useQueryParams() {
  const route = useRoute()

  // 获取 name 参数
  const name = route.query.name || ''

  // 处理 dateRange 参数

  if (!route.query.dateRange) {
    return useDateRange()
  }
  let [start, end] = route.query.dateRange
  const dateRange = ref([new Date(+start), new Date(+end)])

  return { name, dateRange }
}
