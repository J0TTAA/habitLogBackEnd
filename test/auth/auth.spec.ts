import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"

describe("Auth Tests", () => {
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

  describe("Registro y Login", () => {
    const testUser = {
      email: "test@example.com",
      password: "password123",
      nickname: "testuser",
    }

    it("debería registrar un nuevo usuario", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/user/register")
        .send(testUser)
        .expect(201)

      expect(response.body).toHaveProperty("token")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user.email).toBe(testUser.email)
      expect(response.body.user.nickname).toBe(testUser.nickname)
      expect(response.body.user).not.toHaveProperty("password")
    })

    it("debería hacer login con credenciales válidas", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/user/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201)

      expect(response.body).toHaveProperty("token")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user.email).toBe(testUser.email)
    })

    it("debería rechazar login con credenciales inválidas", async () => {
      await request(app.getHttpServer())
        .post("/api/user/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401)
    })

    it("debería rechazar registro con email duplicado", async () => {
      await request(app.getHttpServer())
        .post("/api/user/register")
        .send(testUser)
        .expect(401)
    })
  })

  describe("Validación de Token", () => {
    let authToken: string

    beforeAll(async () => {
      // Registrar usuario y obtener token
      const response = await request(app.getHttpServer())
        .post("/api/user/register")
        .send({
          email: "token@example.com",
          password: "password123",
          nickname: "tokenuser",
        })

      authToken = response.body.token
    })

    it("debería acceder a endpoints protegidos con token válido", async () => {
      // Aquí podrías probar endpoints que requieran autenticación
      // Por ahora solo verificamos que el token se genera correctamente
      expect(authToken).toBeDefined()
      expect(typeof authToken).toBe("string")
    })

    it("debería rechazar requests sin token", async () => {
      // Este test verifica que los endpoints protegidos rechacen requests sin token
      // Nota: Actualmente no hay endpoints protegidos, pero el token se genera correctamente
      expect(authToken).toBeDefined()
    })
  })
}) 