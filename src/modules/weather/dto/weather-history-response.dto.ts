import type { WeatherSnapshot } from "../interfaces/weather-snapshot.interface"

export class WeatherHistoryResponseDto {
  success: boolean
  data: {
    records: WeatherSnapshot[]
    totalRecords: number
    daysRequested: number
    dateRange: {
      from: Date
      to: Date
    }
  }
  message: string
}
