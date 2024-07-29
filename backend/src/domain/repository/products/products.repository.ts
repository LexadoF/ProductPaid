import { Inject } from '@nestjs/common';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';

export class ProductsRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }
  async getProductsList(): Promise<ProductModel[]> {
    const productsRepo = this.conn.getRepository(ProductModel);
    return await productsRepo.find();
  }

  async getProductById(id: number): Promise<ProductModel[]> {
    const productsRepo = this.conn.getRepository(ProductModel);
    return await productsRepo.find({ where: { id: id } });
  }
}
