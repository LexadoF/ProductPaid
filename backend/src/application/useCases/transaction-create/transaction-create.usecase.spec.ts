import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCreateUsecase } from './transaction-create.usecase';
import { TransactionsService } from '../../../infrastructure/services/transactions/transactions.service';
import {
  CardDto,
  CreateTransactionDto,
  CustomerDto,
  shippingDto,
} from '../../../application/dtos/transactions.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

const mockTransactionsService = {
  createTransaction: jest.fn(),
};

describe('TransactionCreateUsecase', () => {
  let usecase: TransactionCreateUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCreateUsecase,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    usecase = module.get<TransactionCreateUsecase>(TransactionCreateUsecase);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call createTransaction with correct data and return a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        product_ammount: 0,
        product_id: 0,
        customer_email: '',
        card: new CardDto(),
        customer_data: new CustomerDto(),
        shipping_address: new shippingDto(),
        installments: 0,
      };
      const token = 'some-token';
      const result: TransactionModel = {
        id: 0,
        transactionNumber: '',
        status: '',
        product_ammount: 0,
        id_paymentService: '',
        subtotal: 0,
        customer_id: 0,
        product_id: 0,
        delivery_id: 0,
      };

      jest
        .spyOn(mockTransactionsService, 'createTransaction')
        .mockResolvedValue(result);

      expect(await usecase.execute(createTransactionDto, token)).toEqual(
        result,
      );
      expect(mockTransactionsService.createTransaction).toHaveBeenCalledWith(
        createTransactionDto,
        token,
      );
    });

    it('should handle errors from TransactionsService', async () => {
      const createTransactionDto: CreateTransactionDto = {
        product_ammount: 0,
        product_id: 0,
        customer_email: '',
        card: new CardDto(),
        customer_data: new CustomerDto(),
        shipping_address: new shippingDto(),
        installments: 0,
      };
      const token = 'some-token';
      const error = new Error('Transaction failed');

      jest
        .spyOn(mockTransactionsService, 'createTransaction')
        .mockRejectedValue(error);

      await expect(
        usecase.execute(createTransactionDto, token),
      ).rejects.toThrow(error);
    });
  });
});
