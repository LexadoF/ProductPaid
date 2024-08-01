import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { AuthGuard } from './infrastructure/guards/auth.guard';

@Module({
  imports: [
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
    DatabaseModule,
  ],
  providers: [AuthGuard],
})
export class AppModule {}
