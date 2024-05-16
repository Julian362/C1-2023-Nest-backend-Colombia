import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TransferModel } from '../../models';
import { AccountEntity } from './';

@Entity({
  name: 'transfer',
  schema: 'public',
})
export class TransferEntity implements TransferModel {
  @Column({
    name: 'id',
    type: 'uuid',
    primary: true,
  })
  id = uuid();

  @ManyToOne(() => AccountEntity)
  @JoinColumn()
  outCome: AccountEntity;

  @ManyToOne(() => AccountEntity)
  @JoinColumn()
  inCome: AccountEntity;

  @Column({
    name: 'amount',
    type: 'numeric',
  })
  amount = 0;

  @Column({
    name: 'reason',
    type: 'varchar',
    length: 100,
  })
  reason: string;

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
