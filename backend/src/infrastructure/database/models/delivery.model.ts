import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('deliveries')
export class DeliveryModel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false })
  address: string;
}
