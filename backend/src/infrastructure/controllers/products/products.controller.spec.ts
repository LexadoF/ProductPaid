import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsListUsecase } from '../../../application/useCases/products-list/products-list.usecase';
import { ProductsGetOneByIdUsecase } from '../../../application/useCases/products-get-one-by-id/products-get-one-by-id.usecase';

class MockProductsListUsecase {
  async execute() {
    return [];
  }
}

class MockProductsGetOneByIdUsecase {
  async execute(id: number) {
    return { id, name: 'Sample Product' };
  }
}

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProductsListUsecase: MockProductsListUsecase;
  let mockProductsGetOneByIdUsecase: MockProductsGetOneByIdUsecase;

  beforeEach(async () => {
    mockProductsListUsecase = new MockProductsListUsecase();
    mockProductsGetOneByIdUsecase = new MockProductsGetOneByIdUsecase();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsListUsecase,
          useValue: mockProductsListUsecase,
        },
        {
          provide: ProductsGetOneByIdUsecase,
          useValue: mockProductsGetOneByIdUsecase,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of products', async () => {
    const result = await controller.getAllProducts();
    expect(result).toEqual([]);
  });

  it('should return a single product by id', async () => {
    const id = 1;
    const result = await controller.getProduct(id);
    expect(result).toEqual({ id, name: 'Sample Product' });
  });
});
