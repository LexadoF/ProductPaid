import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../../domain/repository/products/products.repository';
import { ProductModel } from '../../../infrastructure/database/models/product.model';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async getAllProducts(): Promise<ProductModel[]> {
    return this.productsRepository.getProductsList();
  }

  async getProductById(id: number): Promise<ProductModel> {
    return this.productsRepository.getProductById(id);
  }
}
