import { DataSource } from 'typeorm';
import { TrasnactionAbstractionRepository } from './transaction-abstraction.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { BadRequestException, Inject } from '@nestjs/common';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { decode } from 'jsonwebtoken';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { v4 } from 'uuid';
import { DeliveryModel } from '../../../infrastructure/database/models/delivery.model';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import {
  TransactionBaseFee,
  TransactionStatus,
} from '../../enums/transaction.enum';

export class TransactionRepository implements TrasnactionAbstractionRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }

  async createTransaction(
    newTransaction: CreateTransactionDto,
    token: string,
  ): Promise<TransactionModel> {
    const decodedToken = decode(token, { json: true });
    const delivery = new DeliveryModel();

    delivery.addressL1 = newTransaction.shipping_address.address_line_1;
    delivery.addressL2 = newTransaction.shipping_address.address_line_2;
    delivery.country = newTransaction.shipping_address.country;
    delivery.region = newTransaction.shipping_address.region;
    delivery.city = newTransaction.shipping_address.city;
    delivery.name = newTransaction.shipping_address.name;
    delivery.phone_number = newTransaction.shipping_address.phone_number;
    delivery.postal_code = newTransaction.shipping_address.postal_code;

    const deliveryInDB = await this.conn.manager.save(DeliveryModel, delivery);

    const productRepo = this.conn.getRepository(ProductModel);
    const product = await productRepo.findOne({
      where: { id: newTransaction.product_id },
    });
    if (!product || product.stock < newTransaction.product_ammount) {
      throw new BadRequestException('Insufficient stock');
    }
    let deliveryFee: number;
    if (newTransaction.shipping_address.region === 'Cundinamarca') {
      deliveryFee = TransactionBaseFee.FEE_CUND;
    } else if (newTransaction.shipping_address.region === 'Antioquia') {
      deliveryFee = TransactionBaseFee.FEE_ANT;
    }
    product.stock -= newTransaction.product_ammount;
    await productRepo.save(product);
    const transctnum = v4();
    const transaction = new TransactionModel();
    transaction.customer_id = decodedToken.id;
    transaction.product_ammount = newTransaction.product_ammount;
    transaction.status = TransactionStatus.PENDING;
    transaction.transactionNumber = transctnum;
    transaction.delivery_id = deliveryInDB.id;
    transaction.product_id = newTransaction.product_id;
    transaction.subtotal =
      (await this.CalculateSubtotal(
        newTransaction.product_id,
        newTransaction.product_ammount,
      )) +
      TransactionBaseFee.BASE_FEE_GLOBAL +
      deliveryFee;
    return await this.conn.manager.save(TransactionModel, transaction);
  }

  private async CalculateSubtotal(
    id_product: number,
    quantity: number,
  ): Promise<number> {
    const productRepo = this.conn.getRepository(ProductModel);
    const product = await productRepo.findOne({
      where: { id: id_product },
    });
    return product.price * quantity;
  }
}
