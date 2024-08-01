/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from '../../../domain/repository/transaction/transaction.repository';
import { IntegrationRepository } from '../../../domain/repository/integration/integration.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: TransactionRepository;
  let integrationRepository: IntegrationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
        {
          provide: IntegrationRepository,
          useValue: {
            createPaymentWP: jest.fn(),
            getLocalPaymentCrossReference: jest.fn(),
            checkPaymentStatusWP: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    integrationRepository = module.get<IntegrationRepository>(
      IntegrationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
