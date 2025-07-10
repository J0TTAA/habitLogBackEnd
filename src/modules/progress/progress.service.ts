import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Task, TaskDocument } from "../../schemas/task.schema"
import { TaskStatus } from "../../schemas/task.schema"

@Injectable()
export class ProgressService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getProgressMetrics() {
    const totalTasks = await this.taskModel.countDocuments({
      status: { $ne: TaskStatus.DELETED },
    })

    const completedTasks = await this.taskModel.countDocuments({
      status: TaskStatus.DONE,
    })

    const pendingTasks = await this.taskModel.countDocuments({
      status: TaskStatus.PENDING,
    })

    // Calcular XP total
    const xpResult = await this.taskModel.aggregate([
      { $match: { status: TaskStatus.DONE } },
      { $group: { _id: null, totalXP: { $sum: "$xpPercent" } } },
    ])
    const totalXP = xpResult.length > 0 ? xpResult[0].totalXP : 0

    // Tareas por categoría
    const tasksByCategory = await this.taskModel.aggregate([
      { $match: { status: { $ne: TaskStatus.DELETED } } },
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ["$status", TaskStatus.DONE] }, 1, 0] } },
        },
      },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      {
        $project: {
          categoryName: "$category.name",
          categoryColor: "$category.color",
          totalTasks: "$count",
          completedTasks: "$completedCount",
        },
      },
    ])

    // Tareas diarias (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyTasks = await this.taskModel.aggregate([
      { $match: { completedAt: { $gte: sevenDaysAgo }, status: TaskStatus.DONE } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          count: { $sum: 1 },
          xp: { $sum: "$xpPercent" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalXP,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      tasksByCategory,
      dailyTasks,
    }
  }

  async getXPByTimeRange(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return this.taskModel.aggregate([
      { $match: { completedAt: { $gte: startDate }, status: TaskStatus.DONE } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          xp: { $sum: "$xpPercent" },
          tasks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
  }
}
