// PR-01, PR-02, PR-03: Pruebas de Regresión
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { faker } from "@faker-js/faker"

describe("Regression Tests", () => {
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

  describe("PR-01: Verificar creación de tareas tras cambios", () => {
    it("debería mantener funcionalidad de creación después de actualizaciones", async () => {
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
        priority: "high",
      }

      const response = await request(app.getHttpServer()).post("/tasks").send(taskData).expect(201)

      expect(response.body._id).toBeDefined()
      expect(response.body.title).toBe(taskData.title)
      expect(response.body.createdAt).toBeDefined()
    })
  })

  describe("PR-02: Regresión en subida de imagen", () => {
    it("debería mantener funcionalidad de subida de imagen", async () => {
      // Crear tarea
      const taskResponse = await request(app.getHttpServer())
        .post("/tasks")
        .send({
          title: "Task with image",
          description: "Test task for image upload",
        })
        .expect(201)

      const taskId = taskResponse.body._id

      // Subir imagen
      const imageBuffer = Buffer.from("test-image-data")
      const uploadResponse = await request(app.getHttpServer())
        .post(`/tasks/${taskId}/upload-image`)
        .attach("image", imageBuffer, "test.jpg")
        .expect(200)

      expect(uploadResponse.body.imageUrl).toBeDefined()
    })
  })

  describe("PR-03: Regresión en visualización de tareas", () => {
    it("debería mostrar tareas con todos los campos necesarios", async () => {
      const response = await request(app.getHttpServer()).get("/tasks").expect(200)

      if (response.body.length > 0) {
        const task = response.body[0]
        expect(task).toHaveProperty("_id")
        expect(task).toHaveProperty("title")
        expect(task).toHaveProperty("createdAt")
        expect(task).toHaveProperty("completed")
      }
    })
  })
})
