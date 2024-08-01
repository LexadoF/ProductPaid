import { Test, TestingModule } from '@nestjs/testing';
import { UsersGetOneUsecase } from './users-get-one.usecase';
import { UsersService } from '../../../infrastructure/services/users/users.service';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';

const mockUsersService = {
  getUser: jest.fn(),
};

describe('UsersGetOneUsecase', () => {
  let usecase: UsersGetOneUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGetOneUsecase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usecase = module.get<UsersGetOneUsecase>(UsersGetOneUsecase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call getUser with correct email', async () => {
      const email = 'john@example.com';
      const mockCustomer: CustomerModel = {
        id: 1,
        name: 'John Doe',
        email: email,
        password: 'password123',
        address: '123 Main St',
      };

      jest.spyOn(mockUsersService, 'getUser').mockResolvedValue(mockCustomer);

      const result = await usecase.execute(email);
      expect(result).toEqual(mockCustomer);
      expect(mockUsersService.getUser).toHaveBeenCalledWith(email);
    });

    it('should handle errors from UsersService', async () => {
      const email = 'john@example.com';
      const error = new Error('User not found');

      jest.spyOn(mockUsersService, 'getUser').mockRejectedValue(error);

      await expect(usecase.execute(email)).rejects.toThrow(error);
    });
  });
});
