import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../../infrastructure/services/products/products.service';

@Injectable()
export class ProductsGetOneByIdUsecase {
  constructor(private productsService: ProductsService) {}

  async execute(id: number): Promise<any> {
    const product = await this.productsService.getProductById(id);
    return product;
  }
}
