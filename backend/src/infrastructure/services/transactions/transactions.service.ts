import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionRepository } from '../../../domain/repository/transaction/transaction.repository';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

@Injectable()
export class TransactionsService {
  constructor(private transactionRepository: TransactionRepository) {}

  async createTransaction(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel> {
    return await this.transactionRepository.createTransaction(
      newTrasnaction,
      token,
    );
  }
}
