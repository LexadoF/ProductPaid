import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../../infrastructure/services/products/products.service';
import { ProductModel } from '../../../infrastructure/database/models/product.model';

@Injectable()
export class ProductsListUsecase {
  constructor(private productsService: ProductsService) {}

  async execute(): Promise<ProductModel[]> {
    const productsList = await this.productsService.getAllProducts();
    return productsList;
  }
}
