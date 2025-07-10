// PU-01: Pruebas Unitarias - Servicio de Tareas
import { Test, type TestingModule } from "@nestjs/testing"
import { TasksService } from "./tasks.service"
import { getModelToken } from "@nestjs/mongoose"
import { Task } from "./schemas/task.schema"
import { faker } from "@faker-js/faker"

describe("TasksService - Pruebas Unitarias", () => {
  let service: TasksService
  let mockTaskModel: any

  beforeEach(async () => {
    mockTaskModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
  })

  describe("PF-01: Crear tarea", () => {
    it("debería crear una tarea exitosamente", async () => {
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
      }

      const expectedTask = { ...taskData, _id: faker.database.mongodbObjectId() }
      mockTaskModel.create.mockResolvedValue(expectedTask)

      const result = await service.create(taskData)

      expect(mockTaskModel.create).toHaveBeenCalledWith(taskData)
      expect(result).toEqual(expectedTask)
    })

    it("debería fallar al crear tarea sin título", async () => {
      const taskData = {
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
      }

      mockTaskModel.create.mockRejectedValue(new Error("Title is required"))

      await expect(service.create(taskData)).rejects.toThrow("Title is required")
    })
  })

  describe("PF-02: Editar tarea", () => {
    it("debería actualizar una tarea existente", async () => {
      const taskId = faker.database.mongodbObjectId()
      const updateData = { title: faker.lorem.sentence() }
      const updatedTask = { _id: taskId, ...updateData }

      mockTaskModel.findByIdAndUpdate.mockResolvedValue(updatedTask)

      const result = await service.update(taskId, updateData)

      expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(taskId, updateData, { new: true })
      expect(result).toEqual(updatedTask)
    })
  })

  describe("PF-03: Eliminar tarea con historial", () => {
    it("debería marcar tarea como eliminada manteniendo historial", async () => {
      const taskId = faker.database.mongodbObjectId()
      const deletedTask = { _id: taskId, deleted: true, deletedAt: new Date() }

      mockTaskModel.findByIdAndUpdate.mockResolvedValue(deletedTask)

      const result = await service.softDelete(taskId)

      expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        { deleted: true, deletedAt: expect.any(Date) },
        { new: true },
      )
      expect(result.deleted).toBe(true)
    })
  })

  describe("PF-07: Mostrar tareas completadas e incompletas", () => {
    it("debería filtrar tareas por estado de completado", async () => {
      const completedTasks = [
        { _id: "1", completed: true },
        { _id: "2", completed: true },
      ]

      mockTaskModel.find.mockResolvedValue(completedTasks)

      const result = await service.findByStatus(true)

      expect(mockTaskModel.find).toHaveBeenCalledWith({ completed: true })
      expect(result).toEqual(completedTasks)
    })
  })
})
