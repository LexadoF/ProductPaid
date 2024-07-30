import { LoginDto } from '../../../application/dtos/auth.dto';
import { CustomerModel } from '../../../infrastructure/database/models/customer.model';

export abstract class AuthAbstractionRepository {
  abstract Login(data: LoginDto): Promise<CustomerModel>;
  abstract Logout(): any;
}
