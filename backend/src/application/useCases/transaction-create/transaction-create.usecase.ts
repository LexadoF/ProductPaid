import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../../../infrastructure/services/transactions/transactions.service';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

@Injectable()
export class TransactionCreateUsecase {
  constructor(private transactionService: TransactionsService) {}

  async execute(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel> {
    return await this.transactionService.createTransaction(
      newTrasnaction,
      token,
    );
  }
}
