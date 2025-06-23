// PU-02: Pruebas Unitarias - Servicio de Categorías
import { Test, type TestingModule } from "@nestjs/testing"
import { CategoriesService } from "./categories.service"
import { getModelToken } from "@nestjs/mongoose"
import { Category } from "./schemas/category.schema"
import { faker } from "@faker-js/faker"

describe("CategoriesService - Pruebas Unitarias", () => {
  let service: CategoriesService
  let mockCategoryModel: any

  beforeEach(async () => {
    mockCategoryModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
  })

  describe("PF-04: Crear categoría de experiencia", () => {
    it("debería crear una nueva categoría", async () => {
      const categoryData = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        experienceLevel: "beginner",
      }

      const expectedCategory = { ...categoryData, _id: faker.database.mongodbObjectId() }
      mockCategoryModel.create.mockResolvedValue(expectedCategory)

      const result = await service.create(categoryData)

      expect(mockCategoryModel.create).toHaveBeenCalledWith(categoryData)
      expect(result).toEqual(expectedCategory)
    })
  })

  describe("PF-05: Usar categoría existente", () => {
    it("debería encontrar categoría existente por nombre", async () => {
      const categoryName = faker.lorem.word()
      const existingCategory = {
        _id: faker.database.mongodbObjectId(),
        name: categoryName,
      }

      mockCategoryModel.findOne.mockResolvedValue(existingCategory)

      const result = await service.findByName(categoryName)

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ name: categoryName })
      expect(result).toEqual(existingCategory)
    })
  })
})
