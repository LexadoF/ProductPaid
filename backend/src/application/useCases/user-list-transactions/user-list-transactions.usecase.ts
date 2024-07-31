import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../infrastructure/services/users/users.service';

@Injectable()
export class UserListTransactionsUsecase {
  constructor(private userService: UsersService) {}
  async execute(email: string) {
    return await this.userService.getTransactions(email);
  }
}
