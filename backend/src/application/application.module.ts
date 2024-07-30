import { Module } from '@nestjs/common';
import { ProductsService } from '../infrastructure/services/products/products.service';
import { ProductsListUsecase } from './useCases/products-list/products-list.usecase';
import { DomainModule } from '../domain/domain.module';
import { ProductsGetOneByIdUsecase } from './useCases/products-get-one-by-id/products-get-one-by-id.usecase';
import { UsersCreateUsecase } from './useCases/users-create/users-create.usecase';
import { UsersService } from '../infrastructure/services/users/users.service';
import { UsersGetOneUsecase } from './useCases/users-get-one/users-get-one.usecase';
import { UsersUpdateUsecase } from './useCases/users-update/users-update.usecase';
import { UsersDeleteUsecase } from './useCases/users-delete/users-delete.usecase';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [
    ProductsService,
    ProductsListUsecase,
    ProductsGetOneByIdUsecase,
    UsersCreateUsecase,
    UsersService,
    UsersGetOneUsecase,
    UsersUpdateUsecase,
    UsersDeleteUsecase,
  ],
  exports: [
    ProductsListUsecase,
    ProductsGetOneByIdUsecase,
    UsersCreateUsecase,
    UsersGetOneUsecase,
    UsersUpdateUsecase,
    UsersDeleteUsecase,
  ],
})
export class ApplicationModule {}
