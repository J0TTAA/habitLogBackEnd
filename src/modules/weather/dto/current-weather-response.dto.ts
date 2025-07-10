import type { WeatherSnapshot } from "../interfaces/weather-snapshot.interface"

export class CurrentWeatherResponseDto {
  success: boolean
  data: WeatherSnapshot
  message: string
}
