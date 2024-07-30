import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../../../application/dtos/user.dto';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { UsersService } from '../../../infrastructure/services/users/users.service';

@Injectable()
export class UsersUpdateUsecase {
  constructor(private userService: UsersService) {}

  async execute(
    email: string,
    updatedUserFields: UpdateUserDto,
  ): Promise<CustomerModel> {
    return await this.userService.updateUser(email, updatedUserFields);
  }
}
