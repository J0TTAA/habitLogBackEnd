import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type WeatherSnapshotDocument = WeatherSnapshot & Document

@Schema({
  timestamps: true,
  collection: "weather_snapshots",
})
export class WeatherSnapshot {
  @Prop({ required: true, type: Date, index: true })
  date: Date

  @Prop({ required: true, trim: true })
  location: string

  @Prop({ required: true })
  temperature: number

  @Prop({ required: true, trim: true })
  conditions: string

  @Prop({ required: true, enum: ["OpenWeatherMap", "Fallback"] })
  source: string

  @Prop({
    type: {
      humidity: Number,
      pressure: Number,
      feelsLike: Number,
      windSpeed: Number,
      visibility: Number,
      icon: String,
    },
    default: {},
  })
  metadata?: {
    humidity?: number
    pressure?: number
    feelsLike?: number
    windSpeed?: number
    visibility?: number
    icon?: string
  }
}

export const WeatherSnapshotSchema = SchemaFactory.createForClass(WeatherSnapshot)

// Índices para optimizar consultas
WeatherSnapshotSchema.index({ date: -1 })
WeatherSnapshotSchema.index({ source: 1 })
WeatherSnapshotSchema.index({ date: -1, source: 1 })
