import { Controller, Post, Get, Patch, Body } from "@nestjs/common"
import { UserService } from "./user.service"
import { AuthService } from "./auth.service"
import  { CreateUserDto } from "./dto/create-user.dto"
import  { LoginUserDto } from "./dto/login-user.dto"
import { Public } from "../../guards/public.decorator"

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('DTO recibido:', createUserDto);
    return this.authService.register(createUserDto)
  }

  @Public()
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Post("setup")
  async setupLocalUser(createUserDto: CreateUserDto) {
    return this.userService.createOrGetLocalUser(createUserDto)
  }

  @Get("profile")
  async getProfile() {
    return this.userService.getLocalUser()
  }

  @Patch("profile")
  async updateProfile(@Body() body: { nickname: string }) {
    return this.userService.updateLocalUser(body.nickname)
  }
}
