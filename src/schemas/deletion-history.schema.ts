import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type DeletionHistoryDocument = DeletionHistory & Document

@Schema({ timestamps: true })
export class DeletionHistory {
  @Prop({ type: Types.ObjectId, ref: "Task", required: true })
  taskId: Types.ObjectId

  @Prop({ required: true })
  deletedAt: Date

  @Prop({ type: Object, required: true })
  snapshot: Record<string, any> // JSON snapshot del estado anterior

  @Prop({ default: Date.now })
  createdAt: Date
}

export const DeletionHistorySchema = SchemaFactory.createForClass(DeletionHistory)

// Índices
DeletionHistorySchema.index({ taskId: 1 })
DeletionHistorySchema.index({ deletedAt: -1 })
