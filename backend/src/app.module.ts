import { DatabaseModule } from './infrastructure/database/database.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfrastructureModule, DatabaseModule],
})
export class AppModule {}
