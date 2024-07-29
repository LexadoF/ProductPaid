import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appDefaultPort } from './infrastructure/database/enviromental.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appDefaultPort);
}
bootstrap();
