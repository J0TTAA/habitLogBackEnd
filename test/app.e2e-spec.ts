import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // E2E-01: Crear y completar tarea con imagen
  it('/tasks (POST + PATCH)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Push-ups', experience: 15 });

    expect(createRes.status).toBe(201);
    const taskId = createRes.body.id;

    const uploadRes = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/image`)
      .attach('image', 'test/test-image.jpg');

    expect(uploadRes.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
