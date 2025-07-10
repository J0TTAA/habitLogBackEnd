export interface WeatherSnapshot {
    id: string
    timestamp: Date
    location: {
      city: string
      country: string
      coordinates: {
        lat: number
        lon: number
      }
    }
    temperature: {
      current: number
      feelsLike: number
      min: number
      max: number
    }
    conditions: {
      main: string
      description: string
      icon: string
    }
    humidity: number
    pressure: number
    windSpeed: number
    windDirection: number
    visibility: number | null
    source: string
  }
  