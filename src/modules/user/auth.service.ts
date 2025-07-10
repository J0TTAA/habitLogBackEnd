import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "../../schemas/user.schema"
import  { LoginUserDto } from "./dto/login-user.dto"
import { CreateUserDto } from "./dto/create-user.dto"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto

    // Verificar si el usuario ya existe
    const existingUser = await this.userModel.findOne({ 
      $or: [{ email }, { nickname }] 
    })
    
    if (existingUser) {
      throw new UnauthorizedException("El usuario ya existe")
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear nuevo usuario
    const user = new this.userModel({
      email,
      password: hashedPassword,
      nickname,
    })

    const savedUser = await user.save()

    // Generar token
    const payload = { sub: savedUser._id, nickname: savedUser.nickname }
    const token = this.jwtService.sign(payload)

    return {
      user: {
        id: savedUser._id,
        email: savedUser.email,
        nickname: savedUser.nickname,
      },
      token,
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto

    // Buscar usuario por email
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas")
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas")
    }

    // Generar token
    const payload = { sub: user._id, nickname: user.nickname }
    const token = this.jwtService.sign(payload)

    return {
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
      },
      token,
    }
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado")
    }
    return user
  }
} 