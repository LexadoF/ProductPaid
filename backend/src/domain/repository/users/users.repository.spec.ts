/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { v4 } from 'uuid';
import {
  TransactionBaseFee,
  TransactionStatus,
} from '../../enums/transaction.enum';
import { TransactionRepository } from '../transaction/transaction.repository';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import { CreateUserDto } from 'src/application/dtos/user.dto';

const mockProductRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  }),
};

const mockCustomerRepository = {
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  }),
  find: jest.fn(),
};

const mockTransactionRepository = {
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
};

const mockDataSourceImpl = {
  getDataSource: jest.fn(() => ({
    getRepository: jest.fn().mockImplementation((entity: any) => {
      if (entity === CustomerModel) {
        return mockCustomerRepository;
      }
      if (entity === TransactionModel) {
        return mockTransactionRepository;
      }
      return null;
    }),
    manager: {
      save: jest.fn(),
      delete: jest.fn(),
    },
  })) as unknown as DataSource,
};

describe('Repositories', () => {
  let transactionRepository: TransactionRepository;
  let usersRepository: UsersRepository;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        UsersRepository,
        {
          provide: DataSourceImpl,
          useValue: mockDataSourceImpl,
        },
      ],
    }).compile();

    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('TransactionRepository', () => {
    it('should be defined', () => {
      expect(transactionRepository).toBeDefined();
    });

    it('should create a transaction and save it', async () => {
      const newTransaction: CreateTransactionDto = {
        product_id: 1,
        product_ammount: 2,
        shipping_address: {
          address_line_1: '123 Street',
          address_line_2: '',
          country: 'CO',
          region: 'Bogotá',
          city: 'Bogotá',
          name: 'John Doe',
          phone_number: '1234567890',
          postal_code: '110111',
        },
        customer_email: 'john.doe@example.com',
        card: {
          number: '4111111111111111',
          exp_month: '09',
          exp_year: '29',
          cvc: '123',
          card_holder: 'Jhon Doe',
        },
        customer_data: {
          full_name: 'John Doe',
          legal_id: '1026263565',
          legal_id_type: 'CC',
          phone_number: '57322345321',
        },
        installments: 1,
      };
      const token = 'mocked-token';

      jest
        .spyOn(transactionRepository, 'createTransaction')
        .mockResolvedValue(new TransactionModel());

      const result = await transactionRepository.createTransaction(
        newTransaction,
        token,
      );

      expect(result).toBeInstanceOf(TransactionModel);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(
        newTransaction,
        token,
      );
    });

    it('should throw an error if insufficient stock', async () => {
      const newTransaction: CreateTransactionDto = {
        product_id: 1,
        product_ammount: 2,
        shipping_address: {
          address_line_1: '123 Street',
          address_line_2: '',
          country: 'CO',
          region: 'Bogotá',
          city: 'Bogotá',
          name: 'John Doe',
          phone_number: '1234567890',
          postal_code: '110111',
        },
        customer_email: 'john.doe@example.com',
        card: {
          number: '4111111111111111',
          exp_month: '09',
          exp_year: '29',
          cvc: '123',
          card_holder: 'Jhon Doe',
        },
        customer_data: {
          full_name: 'John Doe',
          legal_id: '1026263565',
          legal_id_type: 'CC',
          phone_number: '57322345321',
        },
        installments: 1,
      };
      const token = 'mocked-token';

      mockProductRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'test product',
        description: 'test product description',
        image: null,
        price: 10000,
        stock: 0,
      });

      await expect(
        transactionRepository.createTransaction(newTransaction, token),
      ).rejects.toThrow(TypeError);
    });
  });

  describe('UsersRepository', () => {
    it('should be defined', () => {
      expect(usersRepository).toBeDefined();
    });

    it('should create a user', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test',
        address: '123 Test St',
        password: 'password',
      };

      jest.spyOn(usersRepository, 'createUser').mockResolvedValue();

      await usersRepository.createUser(newUser);

      expect(usersRepository.createUser).toHaveBeenCalledWith(newUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const newUser: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        address: '123 Test St',
        password: 'password',
      };

      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);

      await expect(usersRepository.createUser(newUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should retrieve a user by email', async () => {
      const email = 'test@example.com';
      const mockCustomer: CustomerModel = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        address: '123 Test St',
        password: 'hashed-password',
      };

      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest
        .spyOn(usersRepository['conn'].getRepository(CustomerModel), 'find')
        .mockResolvedValue([mockCustomer]);

      const result = await usersRepository.getUser(email);

      expect(usersRepository.userExists).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const email = 'tes3t@example.com';

      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(false);

      await expect(usersRepository.getUser(email)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user does not exist when retrieving transactions', async () => {
      const email = 'test@example.com';

      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(false);

      await expect(usersRepository.getTransactions(email)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return the hashed password when hashing', async () => {
      const plainPassword = 'password';
      const hashedPassword = 'hashed-password';

      jest
        .spyOn(usersRepository, 'hashPassword')
        .mockResolvedValue(hashedPassword);

      const result = await usersRepository.hashPassword(plainPassword);
      expect(result).toBe(hashedPassword);
    });
  });
});
