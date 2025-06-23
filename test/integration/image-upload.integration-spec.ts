// PI-03: Pruebas de Integración - Subida de imagen
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { faker } from "@faker-js/faker"

describe("Image Upload Integration Tests", () => {
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

  describe("PI-03: Subida de imagen", () => {
    it("debería subir imagen y asociarla con tarea", async () => {
      // Crear tarea primero
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      }

      const taskResponse = await request(app.getHttpServer()).post("/tasks").send(taskData).expect(201)

      const taskId = taskResponse.body._id

      // Subir imagen
      const imageBuffer = Buffer.from("fake-image-data")
      const response = await request(app.getHttpServer())
        .post(`/tasks/${taskId}/upload-image`)
        .attach("image", imageBuffer, "test.jpg")
        .expect(200)

      expect(response.body.imageUrl).toBeDefined()
      expect(response.body.imageUrl).toContain(".jpg")
    })

    it("debería rechazar archivos que no son imágenes", async () => {
      const taskId = faker.database.mongodbObjectId()
      const textBuffer = Buffer.from("not an image")

      await request(app.getHttpServer())
        .post(`/tasks/${taskId}/upload-image`)
        .attach("file", textBuffer, "test.txt")
        .expect(400)
    })
  })
})
