import { Inject } from '@nestjs/common';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';
import { ProductsAbstractionRepository } from './products-abstraction.repository';

export class ProductsRepository implements ProductsAbstractionRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }
  async getProductsList(): Promise<ProductModel[]> {
    const productsRepo = this.conn.getRepository(ProductModel);
    return await productsRepo.find();
  }

  async getProductById(id: number): Promise<ProductModel> {
    const productsRepo = this.conn.getRepository(ProductModel);
    const res = await productsRepo.find({ where: { id: id } });
    return res[0];
  }
}
