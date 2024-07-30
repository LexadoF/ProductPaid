import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/user.dto';
import { UsersService } from 'src/infrastructure/services/users/users.service';

@Injectable()
export class UsersCreateUsecase {
  constructor(private userService: UsersService) {}
  async execute(newUser: CreateUserDto) {
    return await this.userService.createUser(newUser);
  }
}
