import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { Reflector } from "@nestjs/core"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configurar CORS
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Prefijo global para la API
  app.setGlobalPrefix("api")

  // Aplicar guardia JWT globalmente
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  const configService = app.get(ConfigService)
  const port = configService.get<number>("PORT") || 3000

  await app.listen(port)
  console.log(` Aplicación ejecutándose en: http://localhost:${port}/api`)
}

bootstrap()
