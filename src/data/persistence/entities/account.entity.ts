import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountTypeEntity, CustomerEntity } from '.';
import { AccountModel } from '../../models';

@Entity({
  name: 'account',
  schema: 'public',
})
export class AccountEntity implements AccountModel {
  @Column({
    name: 'id',
    type: 'varchar',
    primary: true,
  })
  id = generateID();

  @ManyToOne(() => CustomerEntity)
  @JoinColumn()
  customer: CustomerEntity;

  @ManyToOne(() => AccountTypeEntity)
  @JoinColumn()
  accountType: AccountTypeEntity;

  @Column({
    name: 'balance',
    type: 'numeric',
  })
  balance = 0;

  @Column({
    name: 'state',
    type: 'boolean',
  })
  state = true;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  deletedAt?: Date | number;
}

function generateID(): string {
  const bank = process.env.BANK_ID ?? '';
  return 20000 +''+ bank +''+ Math.floor(Math.random() * 10000)
}
