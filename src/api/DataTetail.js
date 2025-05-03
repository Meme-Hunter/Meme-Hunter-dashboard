import { getStartTimeAndEndTimeUnix } from '../../unit/date'
import { API_BASE_URL } from '../../static/api_config'

export const fetchPostPesonDateRangData = async (dateRange, name) => {
  let [start_time, end_time] = getStartTimeAndEndTimeUnix(dateRange)

  const params = {
    name,
    start_time,
    end_time,
  }

  const url = `${API_BASE_URL}/api/stats/person_date_range_detail`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    if (data.code === 200) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error posting data:', error)
    return null
  }
}
