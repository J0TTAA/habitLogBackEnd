import { IsString, IsOptional, IsUrl } from "class-validator"

export class EnvironmentVariables {
  @IsString()
  MONGODB_URI: string

  @IsString()
  WEATHER_API_KEY: string

  @IsOptional()
  @IsUrl()
  WEATHER_API_URL?: string

  @IsOptional()
  @IsString()
  DEFAULT_LOCATION?: string
}
