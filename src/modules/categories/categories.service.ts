import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import  { Model } from "mongoose"
import { Category, CategoryDocument } from "../../schemas/category.schema"
import  { CreateCategoryDto } from "./dto/create-category.dto"
import  { UpdateCategoryDto } from "./dto/update-category.dto"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private configService: ConfigService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      console.log('Creando categoría con DTO:', createCategoryDto);
      const category = new this.categoryModel(createCategoryDto)
      const saved = await category.save()
      console.log('Categoría guardada:', saved);
      return saved
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({ isActive: true }).sort({ createdAt: -1 })
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id)
    if (!category || !(category as any).active) {
      throw new NotFoundException("Categoría no encontrada")
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { ...updateCategoryDto, updatedAt: new Date() },
      { new: true },
    )

    if (!category) {
      throw new NotFoundException("Categoría no encontrada")
    }

    return category
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date() })

    if (!result) {
      throw new NotFoundException("Categoría no encontrada")
    }
  }

  async findByExperienceLevel(level: string): Promise<Category[]> {
    return this.categoryModel.find({
      experienceLevel: level,
      isActive: true,
    })
  }
}
