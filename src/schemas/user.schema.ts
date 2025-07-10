import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  nickname: string

  @Prop({ required: true, unique: true, trim: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: Date.now })
  createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
