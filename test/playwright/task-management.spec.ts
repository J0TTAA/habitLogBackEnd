import { test, expect } from "@playwright/test"

test.describe("Task Management E2E", () => {
  test("should create and complete task with image upload", async ({ page }) => {
    await page.goto("/")

    // Crear tarea
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title"]', "E2E Test Task")
    await page.fill('[data-testid="task-description"]', "Task created via E2E test")
    await page.click('[data-testid="save-task"]')

    // Verificar creación
    await expect(page.locator('[data-testid="task-list"]')).toContainText("E2E Test Task")

    // Completar con imagen
    await page.click('[data-testid="complete-task-button"]')
    await page.setInputFiles('[data-testid="image-upload"]', "./test/fixtures/test-image.jpg")
    await page.click('[data-testid="confirm-complete"]')

    // Verificar completado
    await expect(page.locator('[data-testid="completed-tasks"]')).toContainText("E2E Test Task")
  })
})
