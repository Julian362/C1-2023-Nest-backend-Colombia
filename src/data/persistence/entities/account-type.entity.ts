import { Column, Entity } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AccountTypeModel } from '../../models';

@Entity({
  name: 'account_type',
  schema: 'public',
})
export class AccountTypeEntity implements AccountTypeModel {
  @Column({
    name: 'id',
    type: 'uuid',
    primary: true,
  })
  id = uuid();

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    name: 'state',
    type: 'boolean',
  })
  state = true;
}
