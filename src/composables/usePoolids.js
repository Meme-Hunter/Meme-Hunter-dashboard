import { ref } from 'vue'

export function usePoolids() {
  const poolIds = ref('AoUX6U31X7dYDsXmkg7GZWc98nj5oqBocJtiSiQakPjN')

  function splitPoolIds() {
    if (!poolIds.value) return []

    return poolIds.value
      .split(/[\s,]+/) // 正则：空格、逗号、任意数量都可以作为分隔符
      .map((s) => s.trim()) // 去除首尾空格
      .filter((s) => s.length > 0) // 过滤空字符串
  }
  return {
    poolIds,
    splitPoolIds,
  }
}
