// PI-01: Pruebas de Integración - Backend + MongoDB
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TasksModule } from "../../src/tasks/tasks.module"
import { TasksService } from "../../src/tasks/tasks.service"
import { faker } from "@faker-js/faker"

describe("Database Integration Tests", () => {
  let app: INestApplication
  let tasksService: TasksService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/test"), TasksModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    tasksService = moduleFixture.get<TasksService>(TasksService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("PI-01: Backend + MongoDB", () => {
    it("debería persistir datos en MongoDB correctamente", async () => {
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
      }

      const createdTask = await tasksService.create(taskData)
      expect(createdTask._id).toBeDefined()

      const foundTask = await tasksService.findById(createdTask._id)
      expect(foundTask.title).toBe(taskData.title)
    })

    it("debería manejar transacciones correctamente", async () => {
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      }

      // Simular operación transaccional
      const result = await tasksService.createWithTransaction(taskData)
      expect(result).toBeDefined()
    })
  })
})
