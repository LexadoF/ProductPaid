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
        id: 1,
        name: 'Product 1',
        description: 'Description for product 1',
        price: 1000000,
        stock: 100,
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description for product 2',
        price: 2000000,
        stock: 200,
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Description for product 3',
        price: 3000000,
        stock: 300,
      },
      {
        id: 4,
        name: 'Product 4',
        description: 'Description for product 4',
        price: 4000000,
        stock: 400,
      },
      {
        id: 5,
        name: 'Product 5',
        description: 'Description for product 5',
        price: 5000000,
        stock: 500,
      },
      {
        id: 6,
        name: 'Product 6',
        description: 'Description for product 6',
        price: 6000000,
        stock: 600,
      },
      {
        id: 7,
        name: 'Product 7',
        description: 'Description for product 7',
        price: 7000000,
        stock: 700,
      },
      {
        id: 8,
        name: 'Product 8',
        description: 'Description for product 8',
        price: 8000000,
        stock: 800,
      },
      {
        id: 9,
        name: 'Product 9',
        description: 'Description for product 9',
        price: 9000000,
        stock: 900,
      },
      {
        id: 10,
        name: 'Product 10',
        description: 'Description for product 10',
        price: 10000000,
        stock: 1000,
      },
    ];

    const existingProducts = await productRepository.find({
      where: products.map((product) => ({ name: product.name })),
    });

    if (existingProducts.length === 0) {
      await productRepository.save(products);
    }
  }
}
