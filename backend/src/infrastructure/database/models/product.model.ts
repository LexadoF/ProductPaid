import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class ProductModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true, default: 'N/A' })
  description: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('int', { unsigned: true, default: 0 })
  price: number;

  @Column('int', { unsigned: true, nullable: false, default: 0 })
  stock: number;
}
