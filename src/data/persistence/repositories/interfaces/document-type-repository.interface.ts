import { DocumentTypeEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface DocumentTypeRepositoryInterface
  extends BaseRepositoryInterface<DocumentTypeEntity> {
  findByState(state: boolean): Promise<DocumentTypeEntity[]>;
  findByName(name: string): Promise<DocumentTypeEntity[]>;
}
