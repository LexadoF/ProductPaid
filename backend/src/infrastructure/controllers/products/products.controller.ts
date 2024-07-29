import { Controller, Get } from '@nestjs/common';
import { ProductsListUsecase } from '../../../application/useCases/products-list.usecase/products-list.usecase';

@Controller('products')
export class ProductsController {
  constructor(private productsListUseCase: ProductsListUsecase) {}

  @Get()
  getAllProducts() {
    return this.productsListUseCase.execute();
  }
}
