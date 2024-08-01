import { CheckTransactionStatusUsecase } from './check-transaction-status.usecase';
import { TransactionsService } from '../../../infrastructure/services/transactions/transactions.service';

describe('CheckTransactionStatusUsecase', () => {
  let usecase: CheckTransactionStatusUsecase;
  let transactionsService: jest.Mocked<TransactionsService>;

  beforeEach(() => {
    transactionsService = {
      checkTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionsService>;

    usecase = new CheckTransactionStatusUsecase(transactionsService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });
});
