import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { DataSourceImpl } from './typeorm.config';
import {
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUser,
} from './enviromental.config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const mockDataSource = {
  initialize: jest.fn().mockResolvedValue(void 0),
  getRepository: jest.fn().mockReturnValue({
    save: jest.fn().mockResolvedValue(void 0),
  }),
  options: {
    type: 'mysql',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    charset: 'utf8mb4',
    synchronize: true,
  },
};

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  DataSource: jest.fn().mockImplementation(() => mockDataSource),
}));

describe('TypeORM Config', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DATA_SOURCE',
          useFactory: async () => {
            const localDtImpl = new DataSourceImpl();
            await localDtImpl.initialize();
            return localDtImpl.getDataSource();
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DATA_SOURCE');
  });

  it('should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  it('should have correct configuration', () => {
    const options = dataSource.options as MysqlConnectionOptions;

    expect(options.type).toBe('mysql');
    expect(options.host).toBe(dbHost);
    expect(options.port).toBe(dbPort);
    expect(options.username).toBe(dbUser);
    expect(options.password).toBe(dbPassword);
    expect(options.database).toBe(dbName);
    expect(options.charset).toBe('utf8mb4');
    expect(options.synchronize).toBe(true);
  });
});
