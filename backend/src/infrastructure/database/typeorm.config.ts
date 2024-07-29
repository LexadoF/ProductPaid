import { DataSource } from 'typeorm';
import {
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUser,
} from './enviromental.config';
import { ProductModel } from './models/product.model';
import { CustomerModel } from './models/customer.model';
import { TransactionModel } from './models/transaction.model';
import { DeliveryModel } from './models/delivery.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataSourceImpl {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      entities: [ProductModel, CustomerModel, TransactionModel, DeliveryModel],
      charset: 'utf8mb4',
      synchronize: true,
    });
  }

  getDataSource() {
    return this.dataSource;
  }

  async initialize(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.info('Data source initialized');
    } catch (err) {
      console.error(`Failed to initialize data source: ${err}`);
    }
  }
}
