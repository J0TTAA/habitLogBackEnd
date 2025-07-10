import { Test, type TestingModule } from "@nestjs/testing"
import { HttpModule } from "@nestjs/axios"
import { WeatherController } from "./weather.controller"
import { WeatherService } from "./weather.service"
import { jest } from "@jest/globals"

describe("WeatherController", () => {
  let controller: WeatherController
  let service: WeatherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [WeatherController],
      providers: [WeatherService],
    }).compile()

    controller = module.get<WeatherController>(WeatherController)
    service = module.get<WeatherService>(WeatherService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("getCurrentWeather", () => {
    it("should return current weather data", async () => {
      const mockWeatherData = {
        success: true,
        data: {
          id: "1",
          timestamp: new Date(),
          location: {
            city: "Madrid",
            country: "ES",
            coordinates: { lat: 40.4168, lon: -3.7038 },
          },
          temperature: {
            current: 22,
            feelsLike: 24,
            min: 18,
            max: 26,
          },
          conditions: {
            main: "Clear",
            description: "cielo claro",
            icon: "01d",
          },
          humidity: 45,
          pressure: 1013,
          windSpeed: 3.5,
          windDirection: 180,
          visibility: 10,
          source: "OpenWeatherMap",
        },
        message: "Datos del clima actual obtenidos exitosamente",
      }

      jest.spyOn(service, "getCurrentWeather").mockResolvedValue(mockWeatherData)

      const result = await controller.getCurrentWeather("Madrid")
      expect(result).toEqual(mockWeatherData)
      expect(service.getCurrentWeather).toHaveBeenCalledWith("Madrid", undefined, undefined)
    })
  })
})
