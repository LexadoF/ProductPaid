import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../application/dtos/user.dto';
import { UsersRepository } from '../../../domain/repository/users/users.repository';
import { isEmail } from 'class-validator';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';

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

  async updateUser(
    email: string,
    updatedUserFields: UpdateUserDto,
  ): Promise<CustomerModel> {
    if (!isEmail(email))
      throw new BadRequestException('Please provide a valid email');
    return await this.usersRepository.updateUser(email, updatedUserFields);
  }

  async deleteUser(email: string): Promise<void> {
    if (!isEmail(email))
      throw new BadRequestException('Please provide a valid email');
    return await this.usersRepository.deleteUser(email);
  }
}
