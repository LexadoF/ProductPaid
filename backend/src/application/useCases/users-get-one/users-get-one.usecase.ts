import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../infrastructure/services/users/users.service';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';

@Injectable()
export class UsersGetOneUsecase {
  constructor(private userService: UsersService) {}

  async execute(email: string): Promise<CustomerModel> {
    return await this.userService.getUser(email);
  }
}
