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
import { TransactionStatus } from '../../enums/transaction.enum';

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
    const formattedAddress: string[] = decodedToken.addres.split('|');
    const delivery = new DeliveryModel();

    delivery.addressL1 = formattedAddress[0];
    delivery.addressL2 = formattedAddress[1];
    delivery.country = formattedAddress[2];
    delivery.region = formattedAddress[3];
    delivery.city = formattedAddress[4];
    delivery.name = formattedAddress[5];
    delivery.phone_number = formattedAddress[6];
    delivery.postal_code = formattedAddress[7];

    const deliveryInDB = await this.conn.manager.save(DeliveryModel, delivery);

    const productRepo = this.conn.getRepository(ProductModel);
    const product = await productRepo.findOne({
      where: { id: newTransaction.product_id },
    });
    if (!product || product.stock < newTransaction.product_ammount) {
      throw new BadRequestException('Insufficient stock');
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
    transaction.subtotal = await this.CalculateSubtotal(
      newTransaction.product_id,
      newTransaction.product_ammount,
    );
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
