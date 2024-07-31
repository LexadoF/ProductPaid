import { DataSource } from 'typeorm';
import { integrationAbstractionRepository } from './integration-abstraction.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { Inject } from '@nestjs/common';
import { TransactionStatus } from '../../enums/transaction.enum';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import {
  CardDto,
  CustomerDto,
  shippingDto,
} from '../../../application/dtos/transactions.dto';
import axios, { AxiosError } from 'axios';
import {
  appBaseUrlIntegration,
  appIntegrationKey,
  appPubKey,
} from '../../../infrastructure/database/enviromental.config';

export class IntegrationRepository implements integrationAbstractionRepository {
  private conn: DataSource;
  private baseUrlIntegration: string;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
    this.baseUrlIntegration = appBaseUrlIntegration;
  }
  async createPaymentWP(
    transactionNumber: string,
    customerEmail: string,
    cartToDebit: CardDto,
    subtotal: number,
    customerData: CustomerDto,
    shippDetails: shippingDto,
    installments: number,
  ): Promise<void> {
    const tokenCard = await this.tokenizeCard(cartToDebit);
    const secureSignature = await this.hashSignature(
      `${transactionNumber}${subtotal}COP${appIntegrationKey}`,
    );

    try {
      const res = await axios.post(
        `${this.baseUrlIntegration}transactions`,
        {
          acceptance_token: await this.getAcceptToken(),
          amount_in_cents: subtotal,
          currency: 'COP',
          signature: secureSignature,
          customer_email: customerEmail,
          payment_method: {
            type: 'CARD',
            token: tokenCard,
            installments: installments,
          },
          reference: transactionNumber,
          customer_data: {
            phone_number: customerData.phone_number,
            full_name: customerData.full_name,
            legal_id: customerData.legal_id,
            legal_id_type: customerData.legal_id_type,
          },
          shipping_address: {
            address_line_1: shippDetails.address_line_1,
            address_line_2: shippDetails.address_line_2 || '',
            country: shippDetails.country,
            region: shippDetails.region,
            city: shippDetails.city,
            name: shippDetails.name || '',
            phone_number: shippDetails.phone_number,
            postal_code: shippDetails.postal_code || '',
          },
        },
        { headers: { Authorization: `Bearer ${appPubKey}` } },
      );

      await this.saveLocalIntegrationReference(
        res.data.data.id,
        transactionNumber,
      );

      setTimeout(async () => {
        await this.checkPaymentStatusWP(res.data.data.id);
      }, 5000);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw Error(JSON.stringify(error.response.data));
      }
    }
  }

  async checkPaymentStatusWP(externalTransactionId: string): Promise<void> {
    const paymentStatus = await axios.get(
      `${this.baseUrlIntegration}transactions/${externalTransactionId}`,
    );

    await this.crossReferencePaymentStatus(
      paymentStatus.data?.data?.id,
      paymentStatus.data?.data?.status,
      paymentStatus.data?.data?.reference,
    );
  }

  private async crossReferencePaymentStatus(
    externalTransactionId: string,
    statusToReference: string,
    localReference: string,
  ): Promise<void> {
    const transactionRepo = this.conn.getRepository(TransactionModel);

    const product = await transactionRepo.findOne({
      where: {
        id_paymentService: externalTransactionId,
        transactionNumber: localReference,
      },
    });

    if (product && product.status === (TransactionStatus.PENDING as string))
      await this.updateLocalTransactionStatus(
        product.transactionNumber,
        statusToReference as TransactionStatus,
      );
  }

  private async saveLocalIntegrationReference(
    externalTransactionId: string,
    localtransactionReference: string,
  ): Promise<void> {
    const transactionRepo = this.conn.getRepository(TransactionModel);
    const product = await transactionRepo.findOne({
      where: { transactionNumber: localtransactionReference },
    });
    product.id_paymentService = externalTransactionId;
    await transactionRepo.save(product);
  }

  private async updateLocalTransactionStatus(
    transactionNumber: string,
    newStatus: TransactionStatus,
  ): Promise<void> {
    const transactionRepo = this.conn.getRepository(TransactionModel);
    const transaction = await transactionRepo.findOne({
      where: { transactionNumber: transactionNumber },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== newStatus) {
      if (
        newStatus === TransactionStatus.DECLINED ||
        newStatus === TransactionStatus.ERROR
      ) {
        const productRepo = this.conn.getRepository(ProductModel);
        const product = await productRepo.findOne({
          where: { id: transaction.product_id },
        });

        if (product) {
          product.stock += transaction.product_ammount;
          await productRepo.save(product);
        }
      }
      transaction.status = newStatus;
      await transactionRepo.save(transaction);
    }
  }

  private async hashSignature(inputString: string): Promise<string> {
    const encodedText = new TextEncoder().encode(inputString);

    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex;
  }

  private async tokenizeCard(card: CardDto): Promise<string> {
    const cardToken = await axios.post(
      `${this.baseUrlIntegration}tokens/cards`,
      {
        number: card.number,
        cvc: card.cvc,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        card_holder: card.card_holder,
      },
      {
        headers: {
          Authorization: `Bearer ${appPubKey}`,
        },
      },
    );

    return cardToken.data.data.id;
  }

  private async getAcceptToken(): Promise<string> {
    const accToken = await axios.get(
      `${this.baseUrlIntegration}merchants/${appPubKey}`,
    );

    return accToken.data.data.presigned_acceptance.acceptance_token;
  }
}
