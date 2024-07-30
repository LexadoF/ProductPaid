import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsListUsecase } from '../../../application/useCases/products-list/products-list.usecase';
import { ProductsGetOneByIdUsecase } from '../../../application/useCases/products-get-one-by-id/products-get-one-by-id.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private productsListUseCase: ProductsListUsecase,
    private getProductUseCase: ProductsGetOneByIdUsecase,
  ) {}

  @Get()
  getAllProducts() {
    return this.productsListUseCase.execute();
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.getProductUseCase.execute(id);
  }
}
