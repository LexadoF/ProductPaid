import { Test, TestingModule } from '@nestjs/testing';
import { ProductSeeder } from './products.seed';
import { DataSourceImpl } from '../typeorm.config';

const mockProductRepository = {
  delete: jest.fn(),
  save: jest.fn(),
};

const mockDataSource = {
  getDataSource: jest.fn().mockReturnValue({
    getRepository: jest.fn().mockReturnValue(mockProductRepository),
  }),
};

jest.mock('../typeorm.config', () => ({
  DataSourceImpl: jest.fn().mockImplementation(() => mockDataSource),
}));

describe('ProductSeeder', () => {
  let productSeeder: ProductSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSeeder,
        {
          provide: DataSourceImpl,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    productSeeder = module.get<ProductSeeder>(ProductSeeder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productSeeder).toBeDefined();
  });

  it('should seed products correctly', async () => {
    await productSeeder.seed();

    expect(mockProductRepository.delete).toHaveBeenCalledWith({});

    expect(mockProductRepository.save).toHaveBeenCalledWith([
      {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 10.0,
        stock: 100,
      },
      {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 20.0,
        stock: 200,
      },
      {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 30.0,
        stock: 300,
      },
      {
        name: 'Product 4',
        description: 'Description for product 4',
        price: 40.0,
        stock: 400,
      },
      {
        name: 'Product 5',
        description: 'Description for product 5',
        price: 50.0,
        stock: 500,
      },
      {
        name: 'Product 6',
        description: 'Description for product 6',
        price: 60.0,
        stock: 600,
      },
      {
        name: 'Product 7',
        description: 'Description for product 7',
        price: 70.0,
        stock: 700,
      },
      {
        name: 'Product 8',
        description: 'Description for product 8',
        price: 80.0,
        stock: 800,
      },
      {
        name: 'Product 9',
        description: 'Description for product 9',
        price: 90.0,
        stock: 900,
      },
      {
        name: 'Product 10',
        description: 'Description for product 10',
        price: 100.0,
        stock: 1000,
      },
    ]);
  });
});
