import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/user.dto';
import { UsersService } from '../../../infrastructure/services/users/users.service';

@Injectable()
export class UsersCreateUsecase {
  constructor(private userService: UsersService) {}
  async execute(newUser: CreateUserDto) {
    return await this.userService.createUser(newUser);
  }
}
