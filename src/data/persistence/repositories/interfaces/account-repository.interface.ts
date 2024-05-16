import { AccountEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface AccountRepositoryInterface
  extends BaseRepositoryInterface<AccountEntity> {
  findByState(state: boolean): Promise<AccountEntity[]>;
  findByCustomer(customerId: string): Promise<AccountEntity[]>;
  findByAccountType(accountTypeId: string): Promise<AccountEntity[]>;
}
