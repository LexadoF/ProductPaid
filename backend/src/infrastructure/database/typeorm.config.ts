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

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [ProductModel, CustomerModel],
  charset: 'utf8mb4',
  synchronize: true,
});

export const initializeDataSource = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.info('Data source initialized');
  } catch (err) {
    console.error(`Failed to initialize data source: ${err}`);
    process.exit(1);
  }
};
