import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import  { Model } from "mongoose"
import { DeletionHistory, DeletionHistoryDocument } from "../../schemas/deletion-history.schema"
import  { Task } from "../../schemas/task.schema"

@Injectable()
export class DeletionHistoryService {
  constructor(@InjectModel(DeletionHistory.name) private deletionHistoryModel: Model<DeletionHistoryDocument>) {}

  async createDeletionRecord(task: Task): Promise<DeletionHistory> {
    const deletionRecord = new this.deletionHistoryModel({
      taskId: (task as any)._id,
      deletedAt: new Date(),
      snapshot: {
        title: task.title,
        description: task.description,
        xpPercent: task.xpPercent,
        categoryId: task.categoryId,
        timeOfDay: task.timeOfDay,
        status: task.status,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        weatherId: task.weatherId,
      },
    })

    return deletionRecord.save()
  }

  async getDeletionHistory(): Promise<DeletionHistory[]> {
    return this.deletionHistoryModel.find().populate("taskId").sort({ deletedAt: -1 })
  }

  async getTaskDeletionRecord(taskId: string): Promise<DeletionHistory | null> {
    return this.deletionHistoryModel.findOne({ taskId })
  }
}
