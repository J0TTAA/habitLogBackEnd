import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string

  @Prop({ trim: true, default: "#3B82F6" })
  color: string

  @Prop({ default: Date.now })
  createdAt: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)
