import { TransactionStatus } from '../../../domain/enums/transaction-status.enum';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';

export abstract class TrasnactionAbstractionRepository {
  abstract createTransaction(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<void>;
  abstract updateTransactionStatus(
    transactionNumber: string,
    newStatus: TransactionStatus,
  ): Promise<void>;
}
