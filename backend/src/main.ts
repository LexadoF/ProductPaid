import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appDefaultPort } from './infrastructure/database/enviromental.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appDefaultPort);
}
bootstrap();
