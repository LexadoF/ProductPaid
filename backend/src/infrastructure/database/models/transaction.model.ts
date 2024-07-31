import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerModel } from './customer.model';
import { ProductModel } from './product.model';
import { DeliveryModel } from './delivery.model';

@Entity('transactions')
export class TransactionModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false, unique: true })
  transactionNumber: string;

  @Column('varchar', { nullable: false, default: 'PENDING' })
  status: string;

  @Column('int', { unsigned: true, default: 1, nullable: false })
  product_ammount: number;

  @Column('varchar', { nullable: true })
  id_paymentService: string;

  @Column('int', { nullable: false })
  subtotal: number;

  @ManyToOne(() => CustomerModel, (customer) => customer.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer_id: number;

  @ManyToOne(() => ProductModel, (product) => product.id, { nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product_id: number;

  @ManyToOne(() => DeliveryModel, (delivery) => delivery.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'delivery_id', referencedColumnName: 'id' })
  delivery_id: number;
}
