import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  // PF-04: Crear categoría de experiencia
  it('should create a new category', async () => {
    const result = await service.create({ name: 'Yoga' });
    expect(result.name).toBe('Yoga');
  });
});
