// Configuración global para todas las pruebas
beforeAll(async () => {
  // Configuración inicial si es necesaria
})

afterAll(async () => {
  // Limpieza global
})

// Mock global para servicios externos
jest.mock("axios")
jest.mock("fs/promises")

// Configuración de timeouts
jest.setTimeout(30000)
