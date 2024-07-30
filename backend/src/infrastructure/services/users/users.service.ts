import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { UsersRepository } from '../../../domain/repository/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(newUser: CreateUserDto): Promise<any> {
    return await this.usersRepository.createUser(newUser);
  }
}
