import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CustomerModel } from '../../models';
import { DocumentTypeEntity } from './';

@Entity({
  name: 'customer',
  schema: 'public',
})
export class CustomerEntity implements CustomerModel {
  @Column({
    name: 'id',
    type: 'uuid',
    primary: true,
  })
  id = uuid();

  @ManyToOne(() => DocumentTypeEntity ,{
    cascade: false
  })
  @JoinColumn()
  documentType: DocumentTypeEntity;

  @Column({
    name: 'document',
    type: 'varchar',
    length: 20,
  })
  document: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 100,
  })
  fullName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatarUrl?: string;

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

