import { UserListTransactionsUsecase } from './user-list-transactions.usecase';
import { UsersService } from '../../../infrastructure/services/users/users.service';

describe('UserListTransactionsUsecase', () => {
  let usecase: UserListTransactionsUsecase;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    usersService = {
      getTransactions: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    usecase = new UserListTransactionsUsecase(usersService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });
});
