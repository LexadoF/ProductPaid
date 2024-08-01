import { Test, TestingModule } from '@nestjs/testing';
import { UsersCreateUsecase } from './users-create.usecase';
import { UsersService } from '../../../infrastructure/services/users/users.service';
import { CreateUserDto } from '../../dtos/user.dto';

const mockUsersService = {
  createUser: jest.fn(),
};

describe('UsersCreateUsecase', () => {
  let usecase: UsersCreateUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersCreateUsecase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usecase = module.get<UsersCreateUsecase>(UsersCreateUsecase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call createUser with correct data', async () => {
      const newUser: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        address: '123 Main St',
      };

      jest.spyOn(mockUsersService, 'createUser').mockResolvedValue(newUser);

      await usecase.execute(newUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(newUser);
    });

    it('should handle errors from UsersService', async () => {
      const newUser: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        address: '123 Main St',
      };
      const error = new Error('Create failed');

      jest.spyOn(mockUsersService, 'createUser').mockRejectedValue(error);

      await expect(usecase.execute(newUser)).rejects.toThrow(error);
    });
  });
});
