import { Injectable } from '@nestjs/common';
import {
  CardDto,
  CreateTransactionDto,
  CustomerDto,
  shippingDto,
} from '../../../application/dtos/transactions.dto';
import { TransactionRepository } from '../../../domain/repository/transaction/transaction.repository';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { IntegrationRepository } from '../../../domain/repository/integration/integration.repository';

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
    const customerEmail = newTrasnaction.customer_email;
    const cartToDebit = newTrasnaction.card;
    const subtotal = localtransaction.subtotal;
    const customerData = newTrasnaction.customer_data;
    const shippDetails = newTrasnaction.shipping_address;
    const paymentInstallments = newTrasnaction.installments;

    await this.callExternalPaymentService(
      transactionNum,
      customerEmail,
      cartToDebit,
      subtotal,
      shippDetails,
      customerData,
      paymentInstallments,
    );
    return localtransaction;
  }

  private async callExternalPaymentService(
    transactionNumber: string,
    customerEmail: string,
    cartToDebit: CardDto,
    subtotal: number,
    shippDetails: shippingDto,
    customerData: CustomerDto,
    installments: number,
  ) {
    await this.integrationRepository.createPaymentWP(
      transactionNumber,
      customerEmail,
      cartToDebit,
      subtotal,
      customerData,
      shippDetails,
      installments,
    );
    return;
  }
}
