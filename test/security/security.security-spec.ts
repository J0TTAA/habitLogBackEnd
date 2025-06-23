// PS-01, PS-02, PS-03, PS-04: Pruebas de Seguridad
import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"

describe("Security Tests", () => {
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

  describe("PS-01: Validación de imágenes", () => {
    it("debería rechazar archivos maliciosos", async () => {
      const maliciousFile = Buffer.from('<?php echo "hack"; ?>')

      await request(app.getHttpServer())
        .post("/tasks/123/upload-image")
        .attach("image", maliciousFile, "malicious.php")
        .expect(400)
    })

    it("debería validar tipos MIME de imagen", async () => {
      const textFile = Buffer.from("This is not an image")

      await request(app.getHttpServer())
        .post("/tasks/123/upload-image")
        .attach("image", textFile, "fake.jpg")
        .expect(400)
    })

    it("debería limitar el tamaño de archivo", async () => {
      const largeFile = Buffer.alloc(10 * 1024 * 1024) // 10MB

      await request(app.getHttpServer())
        .post("/tasks/123/upload-image")
        .attach("image", largeFile, "large.jpg")
        .expect(413)
    })
  })

  describe("PS-02: Prevención de inyección (XSS/NoSQL)", () => {
    it("debería prevenir inyección XSS en títulos", async () => {
      const xssPayload = {
        title: '<script>alert("XSS")</script>',
        description: "Normal description",
      }

      const response = await request(app.getHttpServer()).post("/tasks").send(xssPayload).expect(201)

      expect(response.body.title).not.toContain("<script>")
    })

    it("debería prevenir inyección NoSQL", async () => {
      const nosqlPayload = {
        title: { $ne: null },
        description: "NoSQL injection attempt",
      }

      await request(app.getHttpServer()).post("/tasks").send(nosqlPayload).expect(400)
    })
  })

  describe("PS-03: Acceso no autorizado", () => {
    it("debería requerir autenticación para operaciones sensibles", async () => {
      await request(app.getHttpServer()).delete("/tasks/123").expect(401)
    })

    it("debería validar permisos de usuario", async () => {
      // Simular token inválido
      await request(app.getHttpServer()).delete("/tasks/123").set("Authorization", "Bearer invalid-token").expect(401)
    })
  })

  describe("PS-04: Validación de datos en formularios", () => {
    it("debería validar campos requeridos", async () => {
      const invalidData = {
        description: "Missing title",
      }

      const response = await request(app.getHttpServer()).post("/tasks").send(invalidData).expect(400)

      expect(response.body.message).toContain("title")
    })

    it("debería validar longitud de campos", async () => {
      const longTitle = "a".repeat(1000)
      const invalidData = {
        title: longTitle,
        description: "Valid description",
      }

      await request(app.getHttpServer()).post("/tasks").send(invalidData).expect(400)
    })

    it("debería sanitizar entrada de usuario", async () => {
      const unsafeData = {
        title: "Task with <b>HTML</b>",
        description: "Description with <script>alert(1)</script>",
      }

      const response = await request(app.getHttpServer()).post("/tasks").send(unsafeData).expect(201)

      expect(response.body.title).not.toContain("<b>")
      expect(response.body.description).not.toContain("<script>")
    })
  })
})
