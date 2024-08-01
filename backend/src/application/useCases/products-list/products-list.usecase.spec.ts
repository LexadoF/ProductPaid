import { ProductsService } from '../../../infrastructure/services/products/products.service';
import { ProductsListUsecase } from './products-list.usecase';

class MockProductsService {
  getAllProducts = jest
    .fn()
    .mockResolvedValue([{ id: 1, name: 'Test Product' }]);
}

describe('ProductsListUsecase', () => {
  let usecase: ProductsListUsecase;
  let mockProductsService: MockProductsService;

  beforeEach(() => {
    mockProductsService = new MockProductsService();
    usecase = new ProductsListUsecase(
      mockProductsService as unknown as ProductsService,
    );
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should use ProductsService to get products', async () => {
    const products = await usecase.execute();
    expect(products).toEqual([{ id: 1, name: 'Test Product' }]);
    expect(mockProductsService.getAllProducts).toHaveBeenCalled();
  });
});
