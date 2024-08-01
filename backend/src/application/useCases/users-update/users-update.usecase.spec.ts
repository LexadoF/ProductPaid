import { Test, TestingModule } from '@nestjs/testing';
import { UsersUpdateUsecase } from './users-update.usecase';
import { UsersService } from '../../../infrastructure/services/users/users.service';
import { UpdateUserDto } from '../../../application/dtos/user.dto';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';

const mockUsersService = {
  updateUser: jest.fn(),
};

describe('UsersUpdateUsecase', () => {
  let usecase: UsersUpdateUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersUpdateUsecase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usecase = module.get<UsersUpdateUsecase>(UsersUpdateUsecase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call updateUser with correct email and updatedUserFields and return updated user', async () => {
      const email = 'test@example.com';
      const updatedUserFields: UpdateUserDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const updatedUser: CustomerModel = {
        id: 1,
        name: 'New Name',
        email: 'test@example.com',
        address: 'New Address',
        password: 'hashed-password',
      };

      jest.spyOn(mockUsersService, 'updateUser').mockResolvedValue(updatedUser);

      expect(await usecase.execute(email, updatedUserFields)).toEqual(
        updatedUser,
      );
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(
        email,
        updatedUserFields,
      );
    });

    it('should handle errors from UsersService', async () => {
      const email = 'test@example.com';
      const updatedUserFields: UpdateUserDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const error = new Error('Update failed');

      jest.spyOn(mockUsersService, 'updateUser').mockRejectedValue(error);

      await expect(usecase.execute(email, updatedUserFields)).rejects.toThrow(
        error,
      );
    });
  });
});
