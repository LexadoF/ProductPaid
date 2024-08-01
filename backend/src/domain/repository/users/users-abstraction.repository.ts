import { CustomerModel } from '../../../infrastructure/database/models/customer.model';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';

export abstract class usersAbstractionRepository {
  abstract createUser(newUser: CreateUserDto): Promise<void>;
  abstract getUser(email: string): Promise<CustomerModel>;
  abstract getTransactions(email: string): Promise<TransactionModel[]>;
}
