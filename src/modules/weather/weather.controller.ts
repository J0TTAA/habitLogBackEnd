import { Controller, Get, Query } from "@nestjs/common"
import { WeatherService } from "./weather.service"
import type { CurrentWeatherResponseDto } from "./dto/current-weather-response.dto"
import type { WeatherHistoryResponseDto } from "./dto/weather-history-response.dto"

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get("current")
  async getCurrentWeather(
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('lon') lon?: number
  ): Promise<CurrentWeatherResponseDto> {
    return this.weatherService.getCurrentWeather(city, lat, lon)
  }

  @Get("history")
  async getWeatherHistory(
    @Query('days') days?: number,
    @Query('city') city?: string
  ): Promise<WeatherHistoryResponseDto> {
    const daysToFetch = days || 30
    return this.weatherService.getWeatherHistory(daysToFetch, city)
  }
}
