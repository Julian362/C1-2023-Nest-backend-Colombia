import { CustomerEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface CustomerRepositoryInterface
  extends BaseRepositoryInterface<CustomerEntity> {
  findOneByEmailAndPassword(email: string, password: string): Promise<boolean>;
  findOneByDocumentTypeAndDocument(
    documentTypeId: string,
    document: string,
  ): Promise<CustomerEntity>;
  findOneByEmail(email: string): Promise<CustomerEntity>;
  findOneByPhone(phone: string): Promise<CustomerEntity>;
  findByState(state: boolean): Promise<CustomerEntity[]>;
  findByFullName(fullName: string): Promise<CustomerEntity[]>;
}
