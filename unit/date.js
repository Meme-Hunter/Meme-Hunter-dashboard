export const getDateRange = (start, end) => {
  let startDate = start instanceof Date ? start : new Date(start)
  let endDate = end instanceof Date ? end : new Date(end)

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error('Invalid date input')
  }

  let result = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    result.push(currentDate.toISOString().split('T')[0]) // 格式化为 YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

export const getStartTimeAndEndTimeUnix = (dateRange) => {
  let [start_time, end_time] = [...dateRange.value]
  // 创建 end_time 的副本，防止修改原始对象
  let adjustedEndTime = new Date(end_time)
  adjustedEndTime.setHours(23, 59, 59, 999)
  // 取整，确保结果是整数（秒级时间戳）
  return [Math.floor(start_time.getTime()), Math.floor(adjustedEndTime.getTime())]
}
