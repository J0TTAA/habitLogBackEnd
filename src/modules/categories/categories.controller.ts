import { Controller, Get, Post, Patch, Param, Delete, Query, Body } from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import  { CreateCategoryDto } from "./dto/create-category.dto"
import  { UpdateCategoryDto } from "./dto/update-category.dto"

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get('by-level')
  findByLevel(@Query('level') level: string) {
    return this.categoriesService.findByExperienceLevel(level);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
