import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersCreateUsecase } from '../../../application/useCases/users-create/users-create.usecase';
import { UsersGetOneUsecase } from '../../../application/useCases/users-get-one/users-get-one.usecase';
import { UsersUpdateUsecase } from '../../../application/useCases/users-update/users-update.usecase';
import { UsersDeleteUsecase } from '../../../application/useCases/users-delete/users-delete.usecase';
import { UserListTransactionsUsecase } from '../../../application/useCases/user-list-transactions/user-list-transactions.usecase';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let userCreateUseCase: UsersCreateUsecase;
  let userGetUseCase: UsersGetOneUsecase;
  // let userUpdateUseCase: UsersUpdateUsecase;
  let userDeleteUseCase: UsersDeleteUsecase;
  let usersGetTransactionsUseCase: UserListTransactionsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersCreateUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UsersGetOneUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UsersUpdateUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UsersDeleteUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UserListTransactionsUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userCreateUseCase = module.get<UsersCreateUsecase>(UsersCreateUsecase);
    userGetUseCase = module.get<UsersGetOneUsecase>(UsersGetOneUsecase);
    // userUpdateUseCase = module.get<UsersUpdateUsecase>(UsersUpdateUsecase);
    userDeleteUseCase = module.get<UsersDeleteUsecase>(UsersDeleteUsecase);
    usersGetTransactionsUseCase = module.get<UserListTransactionsUsecase>(
      UserListTransactionsUsecase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        address: '123 Main St',
      };
      jest.spyOn(userCreateUseCase, 'execute').mockResolvedValue();

      expect(await controller.createUser(createUserDto)).toEqual(createUserDto);
    });
  });

  // describe('updateUser', () => {
  //   it('should update a user', async () => {
  //     const email = 'john.doe@example.com';
  //     const updateUserDto: UpdateUserDto = {
  //       name: 'John Updated',
  //       address: '456 Elm St',
  //     };
  //     const updatedUser: CustomerModel = {
  //       email,
  //       ...updateUserDto,
  //       password: 'mockpassword',
  //     };

  //     jest.spyOn(userUpdateUseCase, 'execute').mockResolvedValue(updatedUser);

  //     expect(await controller.updateUser(email, updateUserDto)).toEqual(
  //       updatedUser,
  //     );
  //   });
  // });

  describe('getUser', () => {
    it('should return a user', async () => {
      const email = 'john.doe@example.com';
      const user = {
        id: 123,
        name: 'John Doe',
        email,
        address: '123 Main St',
        password: 'mockpassword',
      };

      jest.spyOn(userGetUseCase, 'execute').mockResolvedValue(user);

      expect(await controller.getUser(email)).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const email = 'john.doe@example.com';
      jest.spyOn(userDeleteUseCase, 'execute').mockResolvedValue();

      expect(await controller.deleteUser(email)).toEqual({ deleted: true });
    });
  });

  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {
      const email = 'john.doe@example.com';
      const transactions = [
        { id: '1', date: '2024-08-01', amount: 100, status: 'completed' },
        { id: '2', date: '2024-08-02', amount: 150, status: 'pending' },
      ];
      jest
        .spyOn(usersGetTransactionsUseCase, 'execute')
        .mockResolvedValue(transactions);

      expect(await controller.getUserTransactions(email)).toEqual(transactions);
    });

    it('should return an empty array if no transactions', async () => {
      const email = 'john.doe@example.com';
      jest.spyOn(usersGetTransactionsUseCase, 'execute').mockResolvedValue([]);

      expect(await controller.getUserTransactions(email)).toEqual([]);
    });
  });
});
