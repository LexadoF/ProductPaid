import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerModel } from './customer.model';
import { ProductModel } from './product.model';

@Entity('transactions')
export class TransactionModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false, unique: true })
  transactionNumber: string;

  @Column('varchar', { nullable: false, default: 'PENDING_APROVAL' })
  status: string;

  @ManyToOne(() => CustomerModel, (customer) => customer.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer_id: CustomerModel | number;

  @ManyToOne(() => ProductModel, (product) => product.id, { nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product_id: ProductModel | number;
}
