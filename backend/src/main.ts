import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appDefaultPort } from './infrastructure/database/enviromental.config';
import { initializeDataSource } from './infrastructure/database/typeorm.config';

async function bootstrap() {
  await initializeDataSource();
  const app = await NestFactory.create(AppModule);
  await app.listen(appDefaultPort);
}
bootstrap();
