import { Test, TestingModule } from '@nestjs/testing';
import { ProductsGetOneByIdUsecase } from './products-get-one-by-id.usecase';
import { ProductsService } from '../../../infrastructure/services/products/products.service';

class MockProductsService {
  async getProductById(id: number): Promise<any> {
    return { id, name: 'Sample Product' };
  }
}

describe('ProductsGetOneByIdUsecase', () => {
  let usecase: ProductsGetOneByIdUsecase;
  let mockProductsService: MockProductsService;

  beforeEach(async () => {
    mockProductsService = new MockProductsService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsGetOneByIdUsecase,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    usecase = module.get<ProductsGetOneByIdUsecase>(ProductsGetOneByIdUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should return a product when execute is called', async () => {
    const id = 1;
    const result = await usecase.execute(id);
    expect(result).toEqual({ id, name: 'Sample Product' });
  });
});
