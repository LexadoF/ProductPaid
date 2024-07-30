import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../../infrastructure/services/products/products.service';
import { ProductModel } from 'src/infrastructure/database/models/product.model';

@Injectable()
export class ProductsGetOneByIdUsecase {
  constructor(private productsService: ProductsService) {}

  async execute(id: number): Promise<ProductModel> {
    const product = await this.productsService.getProductById(id);
    return product;
  }
}
