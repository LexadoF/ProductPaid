import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../../infrastructure/services/products/products.service';

@Injectable()
export class ProductsListUsecase {
  constructor(private productsService: ProductsService) {}

  async execute(): Promise<any> {
    const productsList = await this.productsService.getAllProducts();
    return productsList;
  }
}
