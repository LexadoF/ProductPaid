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
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './database/enviromental.config';
import { TransactionsService } from './services/transactions/transactions.service';
import { TransactionsController } from './controllers/transactions/transactions.controller';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ApplicationModule,
    DomainModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    DataSourceImpl,
    ProductSeeder,
    ProductsService,
    UsersService,
    AuthService,
    TransactionsService,
    AuthGuard,
  ],
  controllers: [
    ProductsController,
    UsersController,
    AuthController,
    TransactionsController,
  ],
})
export class InfrastructureModule {}
