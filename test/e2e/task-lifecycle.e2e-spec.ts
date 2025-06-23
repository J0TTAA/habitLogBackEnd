// E2E-01, E2E-02, E2E-03: Pruebas de Extremo a Extremo
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { faker } from "@faker-js/faker"

describe("End-to-End Task Lifecycle", () => {
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

  describe("E2E-01: Crear y completar tarea con imagen", () => {
    it("debería completar el flujo completo de tarea con imagen", async () => {
      // 1. Crear tarea
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: "fitness",
      }

      const createResponse = await request(app.getHttpServer()).post("/tasks").send(taskData).expect(201)

      const taskId = createResponse.body._id
      expect(createResponse.body.completed).toBe(false)

      // 2. Subir imagen para completar
      const imageBuffer = Buffer.from("completion-image-data")
      const completeResponse = await request(app.getHttpServer())
        .put(`/tasks/${taskId}/complete`)
        .attach("image", imageBuffer, "completion.jpg")
        .expect(200)

      expect(completeResponse.body.completed).toBe(true)
      expect(completeResponse.body.imageUrl).toBeDefined()
      expect(completeResponse.body.completedAt).toBeDefined()

      // 3. Verificar que aparece en tareas completadas
      const completedResponse = await request(app.getHttpServer()).get("/tasks?completed=true").expect(200)

      const completedTask = completedResponse.body.find((t) => t._id === taskId)
      expect(completedTask).toBeDefined()
      expect(completedTask.completed).toBe(true)
    })
  })

  describe("E2E-02: Ver progreso con tareas previas", () => {
    it("debería mostrar progreso actualizado después de completar tareas", async () => {
      // Obtener progreso inicial
      const initialProgress = await request(app.getHttpServer()).get("/tasks/progress").expect(200)

      // Crear y completar nueva tarea
      const taskResponse = await request(app.getHttpServer())
        .post("/tasks")
        .send({
          title: "Progress test task",
          description: "Task for testing progress",
        })
        .expect(201)

      const taskId = taskResponse.body._id

      await request(app.getHttpServer())
        .put(`/tasks/${taskId}/complete`)
        .attach("image", Buffer.from("progress-image"), "progress.jpg")
        .expect(200)

      // Verificar progreso actualizado
      const updatedProgress = await request(app.getHttpServer()).get("/tasks/progress").expect(200)

      expect(updatedProgress.body.completedTasks).toBeGreaterThan(initialProgress.body.completedTasks)
      expect(updatedProgress.body.progressPercentage).toBeGreaterThanOrEqual(initialProgress.body.progressPercentage)
    })
  })

  describe("E2E-03: Eliminar tarea y ver historial", () => {
    it("debería eliminar tarea manteniendo historial", async () => {
      // Crear tarea
      const taskResponse = await request(app.getHttpServer())
        .post("/tasks")
        .send({
          title: "Task to delete",
          description: "This task will be deleted",
        })
        .expect(201)

      const taskId = taskResponse.body._id

      // Eliminar tarea (soft delete)
      await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(200)

      // Verificar que no aparece en lista activa
      const activeTasksResponse = await request(app.getHttpServer()).get("/tasks").expect(200)

      const activeTask = activeTasksResponse.body.find((t) => t._id === taskId)
      expect(activeTask).toBeUndefined()

      // Verificar que aparece en historial
      const historyResponse = await request(app.getHttpServer()).get("/tasks/history").expect(200)

      const deletedTask = historyResponse.body.find((t) => t._id === taskId)
      expect(deletedTask).toBeDefined()
      expect(deletedTask.deleted).toBe(true)
      expect(deletedTask.deletedAt).toBeDefined()
    })
  })
})
