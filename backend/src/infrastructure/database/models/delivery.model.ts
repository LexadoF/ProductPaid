import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('deliveries')
export class DeliveryModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false })
  addressL1: string;

  @Column('varchar', { nullable: true })
  addressL2: string;

  @Column('varchar', { nullable: false, default: 'CO' })
  country: string;

  @Column('varchar', { nullable: false })
  city: string;

  @Column('varchar', { nullable: false })
  phone_number: string;

  @Column('varchar', { nullable: false })
  region: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  postal_code: string;
}
