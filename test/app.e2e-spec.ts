import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get JwtService to generate valid tokens
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  it('/auth/login (POST) should return JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    // Assert that the access_token is present in the response
    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/protected (GET) should return unauthorized without token', async () => {
    await request(app.getHttpServer())
      .get('/auth/protected')
      .expect(401); // Expecting Unauthorized if no token is provided
  });

  it('/auth/protected (GET) should return protected data with valid token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    const token = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/auth/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Assert that protected data is returned
    expect(response.body.message).toBe('Protected data');
  });

  it('/auth/role-protected (GET) should return unauthorized without valid role', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    const token = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/auth/role-protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(403); // Expecting Forbidden if roles are not sufficient
  });

  it('/auth/role-protected (GET) should return data with correct role', async () => {
    // Generate token with "admin" role
    const payload = { username: 'admin', roles: ['admin'] };
    const token = jwtService.sign(payload);

    const response = await request(app.getHttpServer())
      .get('/auth/role-protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200); // Expecting access for admin role

    expect(response.body.message).toBe('Role-based protected data');
  });

  afterAll(async () => {
    await app.close();
  });
});
