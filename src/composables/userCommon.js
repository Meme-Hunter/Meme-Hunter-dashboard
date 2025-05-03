import { ref } from 'vue'

export function useDateRange() {
  let defaultStartTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    defaultEndTime = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  const dateRange = ref([defaultStartTime, defaultEndTime])

  return {
    dateRange,
    defaultStartTime,
    defaultEndTime,
  }
}
