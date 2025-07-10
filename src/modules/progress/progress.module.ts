import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProgressService } from "./progress.service"
import { ProgressController } from "./progress.controller"
import { Task, TaskSchema } from "../../schemas/task.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
