import { ProductsRepository } from './products.repository';
import { DataSource } from 'typeorm';
import { ProductModel } from '../../../infrastructure/database/models/product.model';

class MockDataSourceImpl {
  private repositoryMock = {
    find: jest.fn().mockResolvedValue([]),
  };

  private dataSourceMock = {
    getRepository: jest.fn().mockReturnValue(this.repositoryMock),
  };

  getDataSource() {
    return this.dataSourceMock as unknown as DataSource;
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
