import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserDocument } from "../../schemas/user.schema"
import  { CreateUserDto } from "./dto/create-user.dto"
import  { Model } from "mongoose"

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createOrGetLocalUser(createUserDto?: CreateUserDto): Promise<User> {
    // Buscar si ya existe un usuario local
    let user = await this.userModel.findOne()

    if (!user && createUserDto) {
      // Crear el primer usuario local
      user = new this.userModel(createUserDto)
      await user.save()
    } else if (!user) {
      throw new NotFoundException("No hay usuario local configurado")
    }

    return user
  }

  async updateLocalUser(nickname: string): Promise<User> {
    const user = await this.userModel.findOne()
    if (!user) {
      throw new NotFoundException("No hay usuario local configurado")
    }

    user.nickname = nickname
    return user.save()
  }

  async getLocalUser(): Promise<any> {
    const user = await this.userModel.findOne()
    if (!user) {
      throw new NotFoundException("No hay usuario local configurado")
    }
    // Excluir la contraseña
    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }
}
