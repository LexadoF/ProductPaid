import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { CreateUserDto } from '../../../application/dtos/user.dto';

export abstract class usersAbstractionRepository {
  abstract createUser(newUser: CreateUserDto): Promise<void>;
  abstract getUser(email: string): Promise<CustomerModel>;
}
