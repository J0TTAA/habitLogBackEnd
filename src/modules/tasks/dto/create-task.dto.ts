import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, Matches } from "class-validator"

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  xpPercent: number

  @IsNotEmpty()
  @IsMongoId()
  categoryId: string

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "timeOfDay debe estar en formato HH:MM",
  })
  timeOfDay: string
}
