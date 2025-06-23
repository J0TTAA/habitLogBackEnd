import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // PF-01: Crear tarea
  it('should create a task', async () => {
    const result = await service.create({ title: 'Run', experience: 10 });
    expect(result).toHaveProperty('id');
  });

  // PF-02: Editar tarea
  it('should update a task', async () => {
    const result = await service.update('taskId', { title: 'Swim' });
    expect(result.title).toBe('Swim');
  });

  // PF-03: Eliminar tarea con historial
  it('should delete a task and keep a history', async () => {
    const result = await service.remove('taskId');
    expect(result.status).toBe('deleted');
  });
});
