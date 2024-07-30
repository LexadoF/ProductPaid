import { BadRequestException, Inject } from '@nestjs/common';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';
import { usersAbstractionRepository } from './users-abstraction.repository';
import { CreateUserDto } from 'src/application/dtos/user.dto';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { hash } from 'bcrypt';

export class UsersRepository implements usersAbstractionRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }
  async createUser(newUser: CreateUserDto): Promise<any> {
    const exists = await this.userExists(newUser.email);
    if (exists === false) {
      console.log('enterthus2');
      const userModel = new CustomerModel();
      userModel.email = newUser.email;
      userModel.name = newUser.name;
      userModel.address = newUser.address;
      userModel.password = await this.hashPassword(newUser.password);
      return await this.conn.manager.insert(CustomerModel, userModel);
    } else {
      throw new BadRequestException('User already exists');
    }
  }

  private async userExists(email: string): Promise<boolean> {
    const user = await this.conn
      .getRepository(CustomerModel)
      .createQueryBuilder('customer')
      .where('customer.email = :email', { email: email })
      .getOne();
    if (!user || user === null) return false;
    else return true;
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    return await hash(plainPassword, 10);
  }
}
