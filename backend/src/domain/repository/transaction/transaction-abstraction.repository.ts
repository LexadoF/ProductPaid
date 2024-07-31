import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

export abstract class TrasnactionAbstractionRepository {
  abstract createTransaction(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel>;
}
