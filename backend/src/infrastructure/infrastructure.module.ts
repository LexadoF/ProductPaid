import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ServicesModule, DatabaseModule],
})
export class InfrastructureModule {}
