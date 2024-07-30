import { Inject, UnauthorizedException } from '@nestjs/common';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import { DataSource } from 'typeorm';
import { LoginDto } from 'src/application/dtos/auth.dto';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { compare } from 'bcrypt';

export class AuthRepository {
  private conn: DataSource;

  constructor(@Inject(DataSourceImpl) private dataSourceImpl: DataSourceImpl) {
    this.conn = this.dataSourceImpl.getDataSource();
  }

  async login(data: LoginDto): Promise<CustomerModel> {
    const exists = await this.userExists(data.email);
    if (exists === false)
      throw new UnauthorizedException('Invalid credentials');
    const user = await this.conn
      .getRepository(CustomerModel)
      .find({ where: { email: data.email } });
    const isValidPassword = await this.validatePass(
      data.password,
      user[0].password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    return user[0];
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

  private async validatePass(pass: string, dbpass: string): Promise<boolean> {
    return await compare(pass, dbpass);
  }
}
