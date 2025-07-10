import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Color debe ser un código hexadecimal válido",
  })
  color?: string
}
