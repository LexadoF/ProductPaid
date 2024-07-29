import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/domain/repository/products/products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async getAllProducts() {
    return this.productsRepository.getProductsList();
  }
}
