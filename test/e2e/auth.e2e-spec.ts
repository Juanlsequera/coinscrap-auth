import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }));
  
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/register (POST) - debería fallar con datos inválidos', async () => {
    const invalidData = {
      identifier: 'user1@invalid',
      password: 'short',
      roles: ['admin'],
    };
  
    return request(app.getHttpServer())
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .send(invalidData)
      .expect(400);
  });

  it('/api/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/login')
      .send({ identifier: 'testuser', password: 'password123' })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/api/profile (GET) - Unauthorized', async () => {
    return request(app.getHttpServer()).get('/api/profile').expect(401);
  });
});
