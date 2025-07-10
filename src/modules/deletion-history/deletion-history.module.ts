import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { DeletionHistoryService } from "./deletion-history.service"
import { DeletionHistory, DeletionHistorySchema } from "../../schemas/deletion-history.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: DeletionHistory.name, schema: DeletionHistorySchema }])],
  providers: [DeletionHistoryService],
  exports: [DeletionHistoryService],
})
export class DeletionHistoryModule {}
