import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type TaskDocument = Task & Document

export enum TaskStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  DELETED = "DELETED",
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string

  @Prop({ trim: true })
  description: string

  @Prop({ required: true, min: 0, max: 100 })
  xpPercent: number

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  categoryId: Types.ObjectId

  @Prop({ required: true })
  timeOfDay: string // HH:MM format

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus

  @Prop()
  completedAt: Date

  @Prop({ type: Types.ObjectId, ref: "WeatherSnapshot" })
  weatherId: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)

// Índices para optimizar consultas
TaskSchema.index({ status: 1 })
TaskSchema.index({ categoryId: 1 })
TaskSchema.index({ createdAt: -1 })
