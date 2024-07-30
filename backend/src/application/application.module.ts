import { Module } from '@nestjs/common';
import { ProductsService } from '../infrastructure/services/products/products.service';
import { ProductsListUsecase } from './useCases/products-list/products-list.usecase';
import { DomainModule } from '../domain/domain.module';
import { ProductsGetOneByIdUsecase } from './useCases/products-get-one-by-id/products-get-one-by-id.usecase';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [ProductsService, ProductsListUsecase, ProductsGetOneByIdUsecase],
  exports: [ProductsListUsecase, ProductsGetOneByIdUsecase],
})
export class ApplicationModule {}
