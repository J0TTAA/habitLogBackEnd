import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { HttpModule } from "@nestjs/axios"
import { WeatherController } from "./weather.controller"
import { WeatherService } from "./weather.service"
import { WeatherSnapshot, WeatherSnapshotSchema } from "../../schemas/weather-snapshot.schema"

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: WeatherSnapshot.name, schema: WeatherSnapshotSchema }
    ]),
    HttpModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
