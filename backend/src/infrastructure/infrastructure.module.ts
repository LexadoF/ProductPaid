import { Module } from '@nestjs/common';
import { DataSourceImpl } from './database/typeorm.config';
import { ProductSeeder } from './database/seeds/products.seed';

@Module({
  imports: [],
  providers: [DataSourceImpl, ProductSeeder],
  controllers: [],
})
export class InfrastructureModule {}
