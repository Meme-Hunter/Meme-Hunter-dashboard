<template>
  <div
    ref="chartRef"
    :group="group"
    :autoResize="autoResize"
    style="width: 100%; height: 400px"
  ></div>
</template>

<script setup>
import { watch, onMounted, defineExpose, ref } from 'vue'
import { useECharts } from '../composables/useECharts'

// 接收外部 props
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  group: {
    type: String,
    default: '',
  },
})

const { chartRef, initChart, updateChart, addChartEvent, chartInstance } = useECharts()
const emit = defineEmits(['chartClick'])

// 初始化图表
onMounted(() => {
  initChart(props)
  addChartEvent('click', (params) => {
    emit('chartClick', params)
  })
})

// 动态监听配置更新
watch(
  () => props.options,
  (newOptions) => {
    updateChart(newOptions)
  },
  { deep: true },
)

// 暴露 chartInstance 给父组件
defineExpose({
  chartInstance,
})
</script>
