import { Column, Entity } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DocumentTypeModel } from '../../models';

@Entity({
  name: 'document_type',
  schema: 'public',
})
export class DocumentTypeEntity implements DocumentTypeModel {
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
