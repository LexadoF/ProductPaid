import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../../../domain/repository/users/users.repository';
import { CreateUserDto } from 'src/application/dtos/user.dto';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { BadRequestException } from '@nestjs/common';

export const mockUsersRepository = {
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getTransactions: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const newUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
      address: 'fictional addrs',
      name: 'Test User',
    };

    jest.spyOn(mockUsersRepository, 'createUser').mockResolvedValue(undefined);

    await service.createUser(newUserDto);

    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(newUserDto);
  });

  it('should retrieve a user successfully', async () => {
    const email = 'test@example.com';
    const mockCustomerModel: CustomerModel = {
      id: 1,
      password: '123456',
      address: 'fictional addrs',
      email: 'test@example.com',
      name: 'Test User',
    };

    jest
      .spyOn(mockUsersRepository, 'getUser')
      .mockResolvedValue(mockCustomerModel);

    const result = await service.getUser(email);

    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockCustomerModel);
  });

  it('should throw BadRequestException for invalid email', async () => {
    const invalidEmail = 'invalid-email';

    await expect(service.getUser(invalidEmail)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should retrieve user transactions successfully', async () => {
    const email = 'test@example.com';
    const mockTransactions = [
      { id: 'txn1', amount: 1000 },
      { id: 'txn2', amount: 2000 },
    ];

    jest
      .spyOn(mockUsersRepository, 'getTransactions')
      .mockResolvedValue(mockTransactions);

    const result = await service.getTransactions(email);

    expect(mockUsersRepository.getTransactions).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockTransactions);
  });

  it('should throw BadRequestException for invalid email during transactions retrieval', async () => {
    const invalidEmail = 'invalid-email';

    await expect(service.getTransactions(invalidEmail)).rejects.toThrow(
      BadRequestException,
    );
  });
});
