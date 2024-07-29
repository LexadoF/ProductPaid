import { Module } from '@nestjs/common';
import { ProductsService } from 'src/infrastructure/services/products/products.service';
import { ProductsListUsecase } from './useCases/products-list.usecase/products-list.usecase';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [ProductsService, ProductsListUsecase],
  exports: [ProductsListUsecase],
})
export class ApplicationModule {}
