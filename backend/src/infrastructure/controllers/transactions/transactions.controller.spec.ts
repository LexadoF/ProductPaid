/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionCreateUsecase } from '../../../application/useCases/transaction-create/transaction-create.usecase';
import { CheckTransactionStatusUsecase } from '../../../application/useCases/check-transaction-status/check-transaction-status.usecase';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionCreateUsecase: TransactionCreateUsecase;
  let checkTransactionStatusUsecase: CheckTransactionStatusUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionCreateUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CheckTransactionStatusUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionCreateUsecase = module.get<TransactionCreateUsecase>(
      TransactionCreateUsecase,
    );
    checkTransactionStatusUsecase = module.get<CheckTransactionStatusUsecase>(
      CheckTransactionStatusUsecase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
