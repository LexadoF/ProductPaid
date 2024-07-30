import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../application/dtos/user.dto';

export abstract class usersAbstractionRepository {
  abstract createUser(newUser: CreateUserDto): Promise<void>;
  abstract getUser(email: string): Promise<CustomerModel>;
  abstract updateUser(
    email: string,
    updatedUserFields: UpdateUserDto,
  ): Promise<CustomerModel>;
}
