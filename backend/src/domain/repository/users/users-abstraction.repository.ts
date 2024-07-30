import { CreateUserDto } from '../../../application/dtos/user.dto';

export abstract class usersAbstractionRepository {
  abstract createUser(newUser: CreateUserDto): Promise<void>;
  // abstract getProductsList(): Promise<ProductModel[]>;
  // abstract getProductById(id: number): Promise<ProductModel>;
}
