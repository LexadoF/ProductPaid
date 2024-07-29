import { ProductsRepository } from '../../../domain/repository/products/products.repository';
import { DataSource } from 'typeorm';
import { ProductModel } from '../../database/models/product.model';

class MockDataSourceImpl {
  private dataSourceMock: Partial<DataSource> = {
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue([]),
    }),
  };

  getDataSource() {
    return this.dataSourceMock as DataSource;
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }
}

describe('ProductsRepository', () => {
  let productsRepository: ProductsRepository;
  let mockDataSourceImpl: MockDataSourceImpl;

  beforeEach(() => {
    mockDataSourceImpl = new MockDataSourceImpl();
    productsRepository = new ProductsRepository(mockDataSourceImpl);
  });

  it('should be defined', () => {
    expect(productsRepository).toBeDefined();
  });

  it('should call getProductsList and return products', async () => {
    const products = await productsRepository.getProductsList();
    expect(products).toEqual([]);
    const repository = mockDataSourceImpl
      .getDataSource()
      .getRepository(ProductModel);
    expect(repository.find).toHaveBeenCalled();
  });
});
