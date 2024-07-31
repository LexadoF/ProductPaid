import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DataSourceImpl } from './typeorm.config';
import { ProductSeeder } from './seeds/products.seed';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [DataSourceImpl, ProductSeeder],
  exports: [DataSourceImpl],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSourceImpl,
    private readonly productSeeder: ProductSeeder,
  ) {}

  async onModuleInit() {
    await this.dataSource.initialize();
    await this.productSeeder.seed();
  }
}
