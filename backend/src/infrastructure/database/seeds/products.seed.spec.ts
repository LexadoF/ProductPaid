import { Test, TestingModule } from '@nestjs/testing';
import { ProductSeeder } from './products.seed';
import { DataSourceImpl } from '../typeorm.config';

const mockProductRepository = {
  find: jest.fn(),
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

  it('should seed products if they do not exist', async () => {
    mockProductRepository.find.mockResolvedValue([]);

    await productSeeder.seed();

    expect(mockProductRepository.find).toHaveBeenCalledWith({
      where: [
        { name: 'Product 1' },
        { name: 'Product 2' },
        { name: 'Product 3' },
        { name: 'Product 4' },
        { name: 'Product 5' },
        { name: 'Product 6' },
        { name: 'Product 7' },
        { name: 'Product 8' },
        { name: 'Product 9' },
        { name: 'Product 10' },
      ],
    });

    expect(mockProductRepository.save).toHaveBeenCalledWith([
      {
        id: 1,
        image: 'https://picsum.photos/200',
        name: 'Product 1',
        description: 'Description for product 1',
        price: 1000000,
        stock: 100,
      },
      {
        id: 2,
        image: 'https://picsum.photos/200',
        name: 'Product 2',
        description: 'Description for product 2',
        price: 2000000,
        stock: 200,
      },
      {
        id: 3,
        image: 'https://picsum.photos/200',
        name: 'Product 3',
        description: 'Description for product 3',
        price: 3000000,
        stock: 300,
      },
      {
        id: 4,
        image: 'https://picsum.photos/200',
        name: 'Product 4',
        description: 'Description for product 4',
        price: 4000000,
        stock: 400,
      },
      {
        id: 5,
        image: 'https://picsum.photos/200',
        name: 'Product 5',
        description: 'Description for product 5',
        price: 5000000,
        stock: 500,
      },
      {
        id: 6,
        image: 'https://picsum.photos/200',
        name: 'Product 6',
        description: 'Description for product 6',
        price: 6000000,
        stock: 600,
      },
      {
        id: 7,
        image: 'https://picsum.photos/200',
        name: 'Product 7',
        description: 'Description for product 7',
        price: 7000000,
        stock: 700,
      },
      {
        id: 8,
        image: 'https://picsum.photos/200',
        name: 'Product 8',
        description: 'Description for product 8',
        price: 8000000,
        stock: 800,
      },
      {
        id: 9,
        image: 'https://picsum.photos/200',
        name: 'Product 9',
        description: 'Description for product 9',
        price: 9000000,
        stock: 900,
      },
      {
        id: 10,
        image: 'https://picsum.photos/200',
        name: 'Product 10',
        description: 'Description for product 10',
        price: 10000000,
        stock: 0,
      },
    ]);
  });

  it('should not seed products if they already exist', async () => {
    mockProductRepository.find.mockResolvedValue([
      {
        id: 1,
        name: 'Product 1',
        description: 'Description for product 1',
        price: 1000000,
        stock: 100,
      },
    ]);

    await productSeeder.seed();

    expect(mockProductRepository.find).toHaveBeenCalledWith({
      where: [
        { name: 'Product 1' },
        { name: 'Product 2' },
        { name: 'Product 3' },
        { name: 'Product 4' },
        { name: 'Product 5' },
        { name: 'Product 6' },
        { name: 'Product 7' },
        { name: 'Product 8' },
        { name: 'Product 9' },
        { name: 'Product 10' },
      ],
    });

    expect(mockProductRepository.save).not.toHaveBeenCalled();
  });
});
