import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../../../infrastructure/services/transactions/transactions.service';

@Injectable()
export class CheckTransactionStatusUsecase {
  constructor(private transactionService: TransactionsService) {}
  async execute(transaction_id: string) {
    return await this.transactionService.checkTransaction(transaction_id);
  }
}
