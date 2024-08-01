import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../../../domain/repository/users/users.repository';

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
});
