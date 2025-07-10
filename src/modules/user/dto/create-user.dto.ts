import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nickname: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string
}
