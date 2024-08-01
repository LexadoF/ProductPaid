import { Test, TestingModule } from '@nestjs/testing';
import { UsersDeleteUsecase } from './users-delete.usecase';
import { UsersService } from '../../../infrastructure/services/users/users.service';

// Create a mock implementation for UsersService
const mockUsersService = {
  deleteUser: jest.fn(),
};

describe('UsersDeleteUsecase', () => {
  let usecase: UsersDeleteUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersDeleteUsecase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usecase = module.get<UsersDeleteUsecase>(UsersDeleteUsecase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call deleteUser with correct email', async () => {
      const email = 'test@example.com';
      jest.spyOn(mockUsersService, 'deleteUser').mockResolvedValue(undefined);

      await usecase.execute(email);
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(email);
    });

    it('should handle errors from UsersService', async () => {
      const email = 'test@example.com';
      const error = new Error('Delete failed');

      jest.spyOn(mockUsersService, 'deleteUser').mockRejectedValue(error);

      await expect(usecase.execute(email)).rejects.toThrow(error);
    });
  });
});
