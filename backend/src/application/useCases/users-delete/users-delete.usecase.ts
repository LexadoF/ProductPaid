import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../infrastructure/services/users/users.service';

@Injectable()
export class UsersDeleteUsecase {
  constructor(private userService: UsersService) {}
  async execute(email: string) {
    return await this.userService.deleteUser(email);
  }
}
