import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsListUsecase } from '../../../application/useCases/products-list.usecase/products-list.usecase';

class MockProductsListUsecase {
  async execute() {
    return [];
  }
}

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProductsListUsecase: MockProductsListUsecase;

  beforeEach(async () => {
    mockProductsListUsecase = new MockProductsListUsecase();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsListUsecase,
          useValue: mockProductsListUsecase,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
