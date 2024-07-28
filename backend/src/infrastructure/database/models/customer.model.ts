import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customers')
export class CustomerModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  address: string;
}
