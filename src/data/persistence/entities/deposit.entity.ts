import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DepositModel } from '../../models';
import { AccountEntity } from './';

@Entity({
  name: 'deposit',
  schema: 'public',
})
export class DepositEntity implements DepositModel {
  @Column({
    name: 'id',
    type: 'uuid',
    primary: true,
  })
  id = uuid();

  @Column({
    name: 'amount',
    type: 'numeric',
  })
  amount = 0;

  @ManyToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;

  @Column({
    name: 'date_time',
    type: 'numeric',
  })
  dateTime: number | Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  deletedAt?: number | Date;
}
