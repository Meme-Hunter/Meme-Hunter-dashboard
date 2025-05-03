<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <el-input v-model="poolIds" type="textarea" autosize placeholder="poolIds 逗号或空格分割" />
    </el-col>
    <el-col :span="6">
      <el-date-picker class="w-100" v-model="dateRange" type="datetimerange" range-separator="至"
        start-placeholder="开始时间" end-placeholder="结束时间" />
    </el-col>
    <el-col :span="4">
      <el-input v-model="userLimit" type="number" placeholder="查询数量：默认100" />
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </el-col>
  </el-row>

  <!-- <el-row>
    <el-col :span="4">

    </el-col>
  </el-row> -->
  <el-row :gutter="20">
    <el-col :span="22">
      <Chart class="chart" ref="priceChart" :options="poolIdsPriceLineChat" :group="'myGroup'"
        @chartClick="handleChatClick" />
    </el-col>

  </el-row>
  <el-row :gutter="20">
    <el-col :span="22">
      <Chart class="chart" ref="solChart" :options="poolIdsSolLineChat" :group="'myGroup'"
        @chartClick="handleChatClick" />
    </el-col>
  </el-row>
</template>
<script setup>
import Chart from '../components/Chart.vue'
import { API_BASE_URL } from '../../static/api_config'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { useDateRange } from '@/composables/userCommon'
import { getStartTimeAndEndTimeUnix } from '../../unit/date'
import { usePoolids } from '@/composables/usePoolids'
import { useUserLimit } from '@/composables/userLimit'
import * as echarts from 'echarts'
import { DecimalsUtils } from '../../unit/decimals'
import { BN } from '@coral-xyz/anchor'

const { dateRange } = useDateRange()
const { poolIds, splitPoolIds } = usePoolids()
const { userLimit } = useUserLimit()
const priceChart = ref()
const solChart = ref()
onMounted(async () => { })
const handleChatClick = (params) => { }

/**
 * 转换数据到价格的series数组 
 *  */
function transformDataToPriceSeries(data) {
  const poolMap = {}

  data.forEach((item) => {
    const { position, states } = item
    let ext = JSON.parse(position.ext)
    // let decimals = ext.buyResult.mintOut.decimals
    states.forEach((state) => {
      const { poolId, createTime, price } = state
      if (!poolMap[poolId]) {
        poolMap[poolId] = []
      }
      poolMap[poolId].push([createTime, DecimalsUtils.formatUnits(new BN(price), 18)])
    })
  })

  // 转成ECharts需要的series数组
  const series = Object.keys(poolMap).map((poolId) => ({
    name: poolId,
    type: 'line',
    showSymbol: false,
    smooth: true,
    data: poolMap[poolId].sort((a, b) => a[0] - b[0]), // 按时间排序
  }))

  return series
}

/**
 * 转换数据到sol的series数组
 *  */
function transformDataToSolSeries(data) {
  const poolMap = {}

  data.forEach((item) => {
    const { position, states } = item
    let ext = JSON.parse(position.ext)
    // let decimals = ext.buyResult.mintOut.decimals
    states.forEach((state) => {
      const { poolId, createTime, solAmout } = state
      if (!poolMap[poolId]) {
        poolMap[poolId] = []
      }
      poolMap[poolId].push([createTime, DecimalsUtils.formatUnits(new BN(solAmount), 9)])
    })
  })

  // 转成ECharts需要的series数组
  const series = Object.keys(poolMap).map((poolId) => ({
    name: poolId,
    type: 'line',
    showSymbol: false,
    smooth: true,
    data: poolMap[poolId].sort((a, b) => a[0] - b[0]), // 按时间排序
  }))

  return series
}


const poolIdsPriceLineChat = reactive({
  yAxis: {
    type: 'value',
    name: '价格',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
})

const poolIdsSolLineChat = reactive({
  // legend: {
  // },
  yAxis: {
    type: 'value',
    name: '数量',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
})


async function fetchStrategyPoolStateTimeRange(startTime, endTime, poolIds, limit, sortOrder) {
  if (poolIds.length < 0) {
    return console.error('poolIds is empty')
  }
  let url = `${API_BASE_URL}/strategy/poolStatesByTimeRange`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poolIdList: poolIds,
        startTime: startTime,
        endTime: endTime,
        limit: limit,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error posting data:', error)
    return null
  }
}

const handleQuery = async () => {
  let [start_time_unix, end_time_unix] = getStartTimeAndEndTimeUnix(dateRange)
  let poolIds = splitPoolIds()

  var data = await fetchStrategyPoolStateTimeRange(
    start_time_unix,
    end_time_unix,
    poolIds,
    userLimit.value,
  )

  let priceSeries = transformDataToPriceSeries(data)
  let solSeries = transformDataToSolSeries(data)

  poolIdsSolLineChat.series = solSeries
  poolIdsPriceLineChat.series = priceSeries
}
</script>
<style>
.w-100 {
  width: 100% !important;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.chart {
  width: 100%;
  height: 500px !important;
  margin-bottom: 50px;
}
</style>
