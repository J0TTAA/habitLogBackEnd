import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ConfigService } from "@nestjs/config"
import { WeatherSnapshot, WeatherSnapshotDocument } from "../../schemas/weather-snapshot.schema"

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultCity: string

  constructor(
    @InjectModel(WeatherSnapshot.name) private weatherModel: Model<WeatherSnapshotDocument>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>("WEATHER_API_KEY") || ""
    this.baseUrl = "https://api.openweathermap.org/data/2.5"
    this.defaultCity = this.configService.get<string>("DEFAULT_LOCATION") || "Madrid"

    if (!this.apiKey) {
      this.logger.error("❌ WEATHER_API_KEY no configurada en .env")
      throw new Error("WEATHER_API_KEY es requerida")
    }

    this.logger.log(`🌤️  Servicio del clima inicializado`)
    this.logger.log(`📍 Ciudad por defecto: ${this.defaultCity}`)
  }

  async getCurrentWeather(city?: string, lat?: number, lon?: number): Promise<any> {
    try {
      let url = `${this.baseUrl}/weather?appid=${this.apiKey}&units=metric&lang=es`

      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`
      } else {
        const targetCity = city || this.defaultCity
        url += `&q=${targetCity}`
      }

      this.logger.log(`🌐 Consultando API del clima: ${url}`)
      const response = await firstValueFrom(this.httpService.get(url))
      const weatherData = response.data

      // Crear snapshot del clima actual
      const weatherSnapshot = new this.weatherModel({
        date: new Date(),
        location: `${weatherData.name}, ${weatherData.sys.country}`,
        temperature: Math.round(weatherData.main.temp),
        conditions: weatherData.weather[0].description,
        source: "OpenWeatherMap",
        metadata: {
          humidity: weatherData.main.humidity,
          pressure: weatherData.main.pressure,
          feelsLike: Math.round(weatherData.main.feels_like),
          windSpeed: weatherData.wind?.speed || 0,
          visibility: weatherData.visibility || 0,
          icon: weatherData.weather[0].icon,
        },
      })

      const savedSnapshot = await weatherSnapshot.save()
      this.logger.log(`✅ Snapshot creado: ${savedSnapshot.temperature}°C, ${savedSnapshot.conditions}`)

      return {
        success: true,
        data: savedSnapshot,
        message: "Datos del clima actual obtenidos exitosamente",
      }
    } catch (error) {
      this.logger.error(`❌ Error al obtener datos del clima: ${error.message}`)
      
      // Crear snapshot de fallback
      const fallbackSnapshot = new this.weatherModel({
        date: new Date(),
        location: city || this.defaultCity,
        temperature: 20,
        conditions: "Datos no disponibles",
        source: "Fallback",
        metadata: {
          humidity: 50,
          pressure: 1013,
          feelsLike: 20,
          windSpeed: 0,
          visibility: 10000,
          icon: "01d",
        },
      })

      const savedFallback = await fallbackSnapshot.save()

      return {
        success: false,
        data: savedFallback,
        message: "Error al obtener datos del clima, usando datos de respaldo",
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async getWeatherHistory(days = 30, city?: string): Promise<any> {
    try {
      let query: any = {}
      
      // Si se especifica una ciudad, filtrar por ubicación
      if (city) {
        query.location = { $regex: city, $options: 'i' }
      }

      const history = await this.weatherModel
        .find(query)
        .sort({ date: -1 })
        .limit(days)
        .exec()

      this.logger.log(`📊 Historial obtenido: ${history.length} registros`)

      return {
        success: true,
        data: {
          records: history,
          totalRecords: history.length,
          daysRequested: days,
          city: city || 'todas',
        },
        message: `Historial de clima obtenido exitosamente`,
      }
    } catch (error) {
      this.logger.error(`❌ Error al obtener historial: ${error.message}`)
      throw new HttpException(
        {
          success: false,
          message: "Error al obtener historial del clima",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
