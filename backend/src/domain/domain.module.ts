import { Module } from '@nestjs/common';
import { ProductsRepository } from './repository/products/products.repository';
import { ProductsService } from '../infrastructure/services/products/products.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository],
})
export class DomainModule {}
