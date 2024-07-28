import { DataSource } from 'typeorm';
import {
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUser,
} from './enviromental.config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [],
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
