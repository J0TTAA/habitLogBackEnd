import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TasksService } from "./tasks.service"
import { TasksController } from "./tasks.controller"
import { Task, TaskSchema } from "../../schemas/task.schema"
import { WeatherModule } from "../weather/weather.module"
import { DeletionHistoryModule } from "../deletion-history/deletion-history.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), WeatherModule, DeletionHistoryModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
