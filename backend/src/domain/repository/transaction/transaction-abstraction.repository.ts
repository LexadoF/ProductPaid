import { TransactionStatus } from '../../../domain/enums/transaction-status.enum';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

export abstract class TrasnactionAbstractionRepository {
  abstract createTransaction(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel>;
  abstract updateTransactionStatus(
    transactionNumber: string,
    newStatus: TransactionStatus,
  ): Promise<void>;
}
