import { BadRequestException, Inject } from '@nestjs/common';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';
import { usersAbstractionRepository } from './users-abstraction.repository';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { hash } from 'bcrypt';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

export class UsersRepository implements usersAbstractionRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }

  async createUser(newUser: CreateUserDto): Promise<void> {
    const exists = await this.userExists(newUser.email);
    if (exists === false) {
      const userModel = new CustomerModel();
      userModel.email = newUser.email;
      userModel.name = newUser.name;
      userModel.address = newUser.address;
      userModel.password = await this.hashPassword(newUser.password);
      await this.conn.manager.insert(CustomerModel, userModel);
      return;
    } else {
      throw new BadRequestException('User already exists');
    }
  }

  async getUser(email: string): Promise<CustomerModel> {
    const exists = await this.userExists(email);
    if (exists === false) {
      throw new BadRequestException('User not exists');
    } else {
      const user = await this.conn
        .getRepository(CustomerModel)
        .find({ where: { email: email } });
      return user[0];
    }
  }

  async getTransactions(email: string): Promise<TransactionModel[]> {
    const exists = await this.userExists(email);
    if (exists === false) {
      throw new BadRequestException('User not exists');
    } else {
      const user = await this.conn
        .getRepository(CustomerModel)
        .createQueryBuilder('customer')
        .where('customer.email = :email', { email: email })
        .getOne();
      const transactionList = await this.conn
        .getRepository(TransactionModel)
        .createQueryBuilder('transaction')
        .where('transaction.customer_id  = :customer_id ', {
          customer_id: user.id,
        })
        .getMany();
      return transactionList;
    }
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.conn
      .getRepository(CustomerModel)
      .createQueryBuilder('customer')
      .where('customer.email = :email', { email: email })
      .getOne();
    if (!user || user === null) return false;
    else return true;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return await hash(plainPassword, 10);
  }
}
