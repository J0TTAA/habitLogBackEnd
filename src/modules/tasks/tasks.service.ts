import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Task, TaskDocument, TaskStatus } from "../../schemas/task.schema"
import type { CreateTaskDto } from "./dto/create-task.dto"
import type { UpdateTaskDto } from "./dto/update-task.dto"
import type { FilterTasksDto } from "./dto/filter-tasks.dto"
import { WeatherService } from "../weather/weather.service"
import { DeletionHistoryService } from "../deletion-history/deletion-history.service"

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private weatherService: WeatherService,
    private deletionHistoryService: DeletionHistoryService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto)
    return task.save()
  }

  async findAll(filterDto: FilterTasksDto): Promise<Task[]> {
    const query: any = {}

    if (filterDto.status) {
      query.status = filterDto.status
    } else {
      // Por defecto, no mostrar tareas eliminadas
      query.status = { $ne: TaskStatus.DELETED }
    }

    if (filterDto.categoryId) {
      query.categoryId = filterDto.categoryId
    }

    return this.taskModel.find(query).populate("categoryId", "name color").populate("weatherId").sort({ createdAt: -1 })
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).populate("categoryId", "name color").populate("weatherId")

    if (!task) {
      throw new NotFoundException("Tarea no encontrada")
    }

    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { ...updateTaskDto, updatedAt: new Date() }, { new: true })
      .populate("categoryId", "name color")
      .populate("weatherId")

    if (!task) {
      throw new NotFoundException("Tarea no encontrada")
    }

    return task
  }

  async softDelete(id: string): Promise<void> {
    const task = await this.findOne(id)

    // Crear registro en historial de eliminación
    await this.deletionHistoryService.createDeletionRecord(task)

    // Marcar como eliminada
    await this.taskModel.findByIdAndUpdate(id, {
      status: TaskStatus.DELETED,
      updatedAt: new Date(),
    })
  }

  async completeTask(id: string): Promise<Task | null> {
    const task = await this.findOne(id)

    if (task.status === TaskStatus.DONE) {
      throw new BadRequestException("La tarea ya está completada")
    }

    // Obtener snapshot del clima actual
    const weatherSnapshot = await this.weatherService.getCurrentWeather()

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          status: TaskStatus.DONE,
          completedAt: new Date(),
          weatherId: (weatherSnapshot as any)._id,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate("categoryId", "name color")
      .populate("weatherId")

    return updatedTask
  }

  async restoreTask(id: string): Promise<Task | null> {
    const deletionRecord = await this.deletionHistoryService.getTaskDeletionRecord(id)

    if (!deletionRecord) {
      throw new NotFoundException("No se encontró registro de eliminación para esta tarea")
    }

    // Restaurar tarea desde el snapshot
    const restoredTask = await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          ...deletionRecord.snapshot,
          status: TaskStatus.PENDING, // Restaurar como pendiente
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate("categoryId", "name color")
      .populate("weatherId")

    return restoredTask
  }

  async getDeletedTasks(): Promise<any[]> {
    const deletionHistory = await this.deletionHistoryService.getDeletionHistory()

    return deletionHistory.map((record) => ({
      id: record.taskId,
      deletedAt: record.deletedAt,
      snapshot: record.snapshot,
    }))
  }
}
