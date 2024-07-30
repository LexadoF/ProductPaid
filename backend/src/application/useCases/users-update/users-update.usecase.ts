import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/application/dtos/user.dto';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
// import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { UsersService } from 'src/infrastructure/services/users/users.service';

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
