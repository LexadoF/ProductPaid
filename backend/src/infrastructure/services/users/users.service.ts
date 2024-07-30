import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { UsersRepository } from '../../../domain/repository/users/users.repository';
import { isEmail } from 'class-validator';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(newUser: CreateUserDto): Promise<void> {
    return await this.usersRepository.createUser(newUser);
  }

  async getUser(email: string): Promise<CustomerModel> {
    if (!isEmail(email))
      throw new BadRequestException('Please provide a valid email');
    return await this.usersRepository.getUser(email);
  }
}
