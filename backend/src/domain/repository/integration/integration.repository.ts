import { DataSource } from 'typeorm';
import { integrationAbstractionRepository } from './integration-abstraction.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { BadRequestException, Inject } from '@nestjs/common';
import { TransactionStatus } from '../../enums/transaction.enum';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { ProductModel } from '../../../infrastructure/database/models/product.model';

/**
 * @class
 */
export class IntegrationRepository implements integrationAbstractionRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }
  async createPaymentWP() {
    throw new Error('Method not implemented.');
  }
  async checkPaymentStatus() {
    throw new Error('Method not implemented.');
  }

  private async updateLocalTransactionStatus(
    transactionNumber: string,
    newStatus: TransactionStatus,
  ): Promise<boolean> {
    const transactionRepo = this.conn.getRepository(TransactionModel);
    const transaction = await transactionRepo.findOne({
      where: { transactionNumber: transactionNumber },
    });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
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
      return true;
    }
    return false;
  }
  private async getTransactionIdWP() {}
  private async hashSignature() {}
  private async tokenizeCard() {}
}
