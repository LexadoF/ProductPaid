import { Module } from '@nestjs/common';
import { DataSourceImpl } from './database/typeorm.config';
import { ProductSeeder } from './database/seeds/products.seed';
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './services/products/products.service';
import { ApplicationModule } from '../application/application.module';
import { DomainModule } from '../domain/domain.module';
import { UsersController } from './controllers/users/users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [ApplicationModule, DomainModule],
  providers: [DataSourceImpl, ProductSeeder, ProductsService, UsersService, AuthService],
  controllers: [ProductsController, UsersController, AuthController],
})
export class InfrastructureModule {}
