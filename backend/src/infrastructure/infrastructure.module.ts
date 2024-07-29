import { Module } from '@nestjs/common';
import { DataSourceImpl } from './database/typeorm.config';
import { ProductSeeder } from './database/seeds/products.seed';
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './services/products/products.service';
import { ApplicationModule } from 'src/application/application.module';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [ApplicationModule, DomainModule],
  providers: [DataSourceImpl, ProductSeeder, ProductsService],
  controllers: [ProductsController],
})
export class InfrastructureModule {}
