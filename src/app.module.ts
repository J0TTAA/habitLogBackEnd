import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "./modules/user/user.module"
import { CategoriesModule } from "./modules/categories/categories.module"
import { TasksModule } from "./modules/tasks/tasks.module"
import { WeatherModule } from "./modules/weather/weather.module"
import { ProgressModule } from "./modules/progress/progress.module"
import { DeletionHistoryModule } from "./modules/deletion-history/deletion-history.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <--- Esto hace que ConfigService esté disponible en toda la app
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CategoriesModule,
    TasksModule,
    WeatherModule,
    ProgressModule,
    DeletionHistoryModule,
  ],
})
export class AppModule {}
