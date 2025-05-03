import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const defaultOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  legend: {
    type: 'scroll', // 横向滚动
    orient: 'horizontal',
    left: 'center',
    pageButtonItemGap: 5,
    pageIconSize: 12,
    pageIconColor: '#333',
    pageTextStyle: {
      color: '#666',
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'time',
    axisLabel: {
      formatter: function (value) {
        const date = new Date(value)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      },
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    name: '数量',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  dataZoom: [
    {
      type: 'inside', // 鼠标滚轮缩放
      start: 90,
      end: 100,
    },
    {
      type: 'slider', // 下方滑块
      height: 20,
      bottom: 10,
      start: 90,
      end: 100,
    },
    {
      type: 'inside', // Y轴鼠标滚轮缩放
      yAxisIndex: 0,
      start: 90,
      end: 100,
    },
    {
      type: 'slider', // Y轴滑块
      yAxisIndex: 0,
      width: 20,
      right: 10,
      start: 90,
      end: 100,
    },
  ],
  series: [
    // 示例 series（实际根据你的数据动态生成）
    {
      name: '图例1',
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: [], // [[timestamp, value], [timestamp, value], ...]
    },
    {
      name: '图例2',
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: [],
    },
    {
      name: '图例3',
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: [],
    },
  ],
}

export function useECharts() {
  const chartRef = ref(null) // DOM 绑定
  let chartInstance = null // ECharts 实例

  const mergeOptions = (customOptions) => {
    return {
      ...defaultOptions,
      ...customOptions,
      series: customOptions.series
        ? customOptions.series.map((s) => ({
            ...defaultOptions.series[0], // 继承默认 series 配置
            ...s,
          }))
        : defaultOptions.series,
    }
  }
  const initChart = (props) => {
    if (!chartRef.value) {
      console.warn('Chart container is not ready.')
      return
    }
    console.log(props)
    // 初始化或重用实例
    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value)
    }
    chartInstance.setOption(mergeOptions(props.options))
    if (props.group) {
      chartInstance.group = props.group
      echarts.connect(props.group)
    }
  }

  const addChartEvent = (eventName, callback) => {
    if (chartInstance) {
      chartInstance.on(eventName, callback)
    }
  }
  const updateChart = (options) => {
    if (chartInstance) {
      chartInstance.setOption(mergeOptions(options), true)
    } else {
      console.warn('Chart instance is not initialized.')
    }
  }

  const resizeChart = () => {
    chartInstance?.resize()
  }

  onMounted(() => {
    window.addEventListener('resize', resizeChart)
  })

  onUnmounted(() => {
    chartInstance?.dispose()
    chartInstance = null
    window.removeEventListener('resize', resizeChart)
  })

  return {
    chartRef,
    initChart,
    updateChart,
    addChartEvent,
  }
}
