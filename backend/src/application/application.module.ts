import { Module } from '@nestjs/common';
import { ProductsService } from '../infrastructure/services/products/products.service';
import { ProductsListUsecase } from './useCases/products-list/products-list.usecase';
import { DomainModule } from '../domain/domain.module';
import { ProductsGetOneByIdUsecase } from './useCases/products-get-one-by-id/products-get-one-by-id.usecase';
import { UsersCreateUsecase } from './useCases/users-create/users-create.usecase';
import { UsersService } from 'src/infrastructure/services/users/users.service';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [
    ProductsService,
    ProductsListUsecase,
    ProductsGetOneByIdUsecase,
    UsersCreateUsecase,
    UsersService,
  ],
  exports: [ProductsListUsecase, ProductsGetOneByIdUsecase, UsersCreateUsecase],
})
export class ApplicationModule {}
