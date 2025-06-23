// Pruebas Funcionales
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { faker } from "@faker-js/faker"

describe("Tasks - Pruebas Funcionales", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("PF-01: Crear tarea", () => {
    it("POST /tasks - debería crear una tarea exitosamente", async () => {
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
      }

      const response = await request(app.getHttpServer()).post("/tasks").send(taskData).expect(201)

      expect(response.body).toHaveProperty("_id")
      expect(response.body.title).toBe(taskData.title)
      expect(response.body.description).toBe(taskData.description)
    })

    it("POST /tasks - debería fallar con datos inválidos", async () => {
      const invalidData = {
        description: faker.lorem.paragraph(),
        // Falta título requerido
      }

      await request(app.getHttpServer()).post("/tasks").send(invalidData).expect(400)
    })
  })

  describe("PF-06: Completar tarea subiendo imagen", () => {
    it("PUT /tasks/:id/complete - debería completar tarea con imagen", async () => {
      // Primero crear una tarea
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      }

      const createResponse = await request(app.getHttpServer()).post("/tasks").send(taskData).expect(201)

      const taskId = createResponse.body._id

      // Completar con imagen
      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}/complete`)
        .attach("image", Buffer.from("fake-image-data"), "test.jpg")
        .expect(200)

      expect(response.body.completed).toBe(true)
      expect(response.body.imageUrl).toBeDefined()
    })
  })

  describe("PF-08: Visualización del progreso", () => {
    it("GET /tasks/progress - debería mostrar progreso del usuario", async () => {
      const response = await request(app.getHttpServer()).get("/tasks/progress").expect(200)

      expect(response.body).toHaveProperty("totalTasks")
      expect(response.body).toHaveProperty("completedTasks")
      expect(response.body).toHaveProperty("progressPercentage")
    })
  })
})
