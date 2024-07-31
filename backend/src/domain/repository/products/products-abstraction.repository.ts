import { ProductModel } from '../../../infrastructure/database/models/product.model';

export abstract class ProductsAbstractionRepository {
  abstract getProductsList(): Promise<ProductModel[]>;
  abstract getProductById(id: number): Promise<ProductModel>;
}
