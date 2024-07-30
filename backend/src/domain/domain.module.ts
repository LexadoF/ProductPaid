import { Module } from '@nestjs/common';
import { ProductsRepository } from './repository/products/products.repository';
import { ProductsService } from '../infrastructure/services/products/products.service';
import { UsersService } from '../infrastructure/services/users/users.service';
import { UsersRepository } from './repository/users/users.repository';
import { AuthRepository } from './repository/logins/auth.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ProductsService,
    ProductsRepository,
    UsersService,
    UsersRepository,
    AuthRepository,
  ],
  exports: [ProductsRepository, UsersRepository, AuthRepository],
})
export class DomainModule {}
