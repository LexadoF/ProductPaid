import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionRepository } from '../../../domain/repository/transaction/transaction.repository';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { IntegrationRepository } from 'src/domain/repository/integration/integration.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionRepository: TransactionRepository,
    private integrationRepository: IntegrationRepository,
  ) {}

  async createTransaction(
    newTrasnaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel> {
    const localtransaction = await this.transactionRepository.createTransaction(
      newTrasnaction,
      token,
    );
    const transactionNum = localtransaction.transactionNumber;
    const deliveryData = localtransaction.delivery_id;
    // await this.callExternalPaymentService(transactionNum, deliveryData);
    return localtransaction;
  }

  async callExternalPaymentService(
    transactionNumber: string,
    delivery: number,
  ) {
    await this.integrationRepository.createPaymentWP();
  }
}
