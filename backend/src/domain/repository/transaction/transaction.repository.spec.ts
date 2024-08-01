import { DataSource } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';

describe('TransactionRepository', () => {
  const mockDataSourceImpl = {
    getDataSource: jest.fn().mockReturnValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        save: jest.fn(),
      }),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn(),
          save: jest.fn(),
        }),
      },
    }) as unknown as DataSource,
  };
  let repository: TransactionRepository;

  beforeEach(() => {
    repository = new TransactionRepository(
      mockDataSourceImpl as unknown as DataSourceImpl,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('TransactionRepository', () => {
    let repository: TransactionRepository;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mockDataSource: jest.Mocked<DataSource>;

    beforeEach(() => {
      mockDataSource = {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue({ id: 1, price: 100 }),
          save: jest.fn().mockResolvedValue({ id: 1 }),
        }),
        manager: {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            save: jest.fn().mockResolvedValue({ id: 1 }),
          }),
        },
      } as unknown as jest.Mocked<DataSource>;

      repository = new TransactionRepository(
        mockDataSourceImpl as unknown as DataSourceImpl,
      );
    });

    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });
});
