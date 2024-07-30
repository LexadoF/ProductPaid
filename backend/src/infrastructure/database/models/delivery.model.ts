import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerModel } from './customer.model';
import { ProductModel } from './product.model';

@Entity('deliveries')
export class DeliveryModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false })
  address: string;

  @ManyToOne(() => CustomerModel, (customer) => customer.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer_id: CustomerModel | number;

  @ManyToOne(() => ProductModel, (product) => product.id, { nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product_id: ProductModel | number;
}
