import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // PF-10: Registrar apodo del usuario
  it('should save user nickname', async () => {
    const result = await service.registerNickname('nicolas');
    expect(result.nickname).toBe('nicolas');
  });
});
