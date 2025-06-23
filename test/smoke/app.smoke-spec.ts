// Pruebas de Humo
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"

describe("Smoke Tests", () => {
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

  describe("Funcionalidades Críticas", () => {
    it("debería responder en el endpoint de salud", async () => {
      await request(app.getHttpServer()).get("/health").expect(200)
    })

    it("debería conectar con la base de datos", async () => {
      await request(app.getHttpServer()).get("/tasks").expect(200)
    })

    it("debería permitir crear una tarea básica", async () => {
      const basicTask = {
        title: "Test Task",
        description: "Basic smoke test task",
      }

      await request(app.getHttpServer()).post("/tasks").send(basicTask).expect(201)
    })

    it("debería mostrar lista de tareas", async () => {
      const response = await request(app.getHttpServer()).get("/tasks").expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })
})
