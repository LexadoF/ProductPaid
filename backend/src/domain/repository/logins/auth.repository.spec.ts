import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

const mockRepository = {
  find: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }),
};

const mockDataSourceImpl = {
  getDataSource: jest.fn().mockReturnValue({
    getRepository: jest.fn().mockReturnValue(mockRepository),
  }),
};

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthRepository', () => {
  let repository: AuthRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSourceImpl: DataSourceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: DataSourceImpl,
          useValue: mockDataSourceImpl,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    dataSourceImpl = module.get<DataSourceImpl>(DataSourceImpl);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(repository as any, 'userExists').mockResolvedValue(false);

      await expect(repository.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = { email: 'user@example.com', password: 'wrongpassword' };
      const user: CustomerModel = {
        id: 1,
        name: 'John Doe',
        email: 'user@example.com',
        password: 'hashedpassword',
        address: '123 Main St',
      };

      jest.spyOn(repository as any, 'userExists').mockResolvedValue(true);
      mockRepository.find.mockResolvedValue([user]);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(repository.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user if credentials are valid', async () => {
      const loginDto = { email: 'user@example.com', password: 'password' };
      const user: CustomerModel = {
        id: 1,
        name: 'John Doe',
        email: 'user@example.com',
        password: 'hashedpassword',
        address: '123 Main St',
      };

      jest.spyOn(repository as any, 'userExists').mockResolvedValue(true);
      mockRepository.find.mockResolvedValue([user]);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await repository.login(loginDto);
      expect(result).toEqual(user);
    });
  });
});
