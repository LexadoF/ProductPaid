import { Inject } from '@nestjs/common';
import { ProductModel } from '../models/product.model';
import { DataSourceImpl } from '../typeorm.config';

export class ProductSeeder {
  constructor(
    @Inject(DataSourceImpl) private readonly dataSource: DataSourceImpl,
  ) {}

  async seed() {
    const productRepository = this.dataSource
      .getDataSource()
      .getRepository(ProductModel);

    const products = [
      {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 10.0,
        stock: 100,
      },
      {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 20.0,
        stock: 200,
      },
      {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 30.0,
        stock: 300,
      },
      {
        name: 'Product 4',
        description: 'Description for product 4',
        price: 40.0,
        stock: 400,
      },
      {
        name: 'Product 5',
        description: 'Description for product 5',
        price: 50.0,
        stock: 500,
      },
      {
        name: 'Product 6',
        description: 'Description for product 6',
        price: 60.0,
        stock: 600,
      },
      {
        name: 'Product 7',
        description: 'Description for product 7',
        price: 70.0,
        stock: 700,
      },
      {
        name: 'Product 8',
        description: 'Description for product 8',
        price: 80.0,
        stock: 800,
      },
      {
        name: 'Product 9',
        description: 'Description for product 9',
        price: 90.0,
        stock: 900,
      },
      {
        name: 'Product 10',
        description: 'Description for product 10',
        price: 100.0,
        stock: 1000,
      },
    ];

    await productRepository.save(products);
  }
}
