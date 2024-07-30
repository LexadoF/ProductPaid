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
import { LoginUsecase } from './useCases/login/login.usecase';
import { AuthService } from '../infrastructure/services/auth/auth.service';
import { TransactionCreateUsecase } from './useCases/transaction-create/transaction-create.usecase';
import { TransactionsService } from '../infrastructure/services/transactions/transactions.service';

@Module({
  imports: [DomainModule],
  providers: [
    ProductsService,
    ProductsListUsecase,
    ProductsGetOneByIdUsecase,
    UsersCreateUsecase,
    UsersService,
    UsersGetOneUsecase,
    UsersUpdateUsecase,
    UsersDeleteUsecase,
    LoginUsecase,
    AuthService,
    TransactionCreateUsecase,
    TransactionsService,
  ],
  exports: [
    ProductsListUsecase,
    ProductsGetOneByIdUsecase,
    UsersCreateUsecase,
    UsersGetOneUsecase,
    UsersUpdateUsecase,
    UsersDeleteUsecase,
    LoginUsecase,
    TransactionCreateUsecase,
  ],
})
export class ApplicationModule {}
