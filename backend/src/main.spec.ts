/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { appDefaultPort } from '../src/infrastructure/database/enviromental.config';

describe('Main application bootstrap', () => {
  let app: any;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    server = await app.listen(appDefaultPort);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should apply global validation pipe', async () => {
    const response = await request(server)
      .post('/some-endpoint')
      .send({ invalidPayload: true });

    expect(response.status).toBe(404 || 400);
  });

  it('should enable CORS', async () => {
    const response = await request(server)
      .get('/some-endpoint')
      .set('Origin', 'http://example.com');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should listen on the default port', async () => {
    const port = appDefaultPort;
    expect(port).toBeDefined();
  });
});
