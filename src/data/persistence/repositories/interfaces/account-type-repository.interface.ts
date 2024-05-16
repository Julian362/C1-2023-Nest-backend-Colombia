import { AccountTypeEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface AccountTypeRepositoryInterface
  extends BaseRepositoryInterface<AccountTypeEntity> {
  findByState(state: boolean): Promise<AccountTypeEntity[]>;
  findByName(name: string): Promise<AccountTypeEntity[]>;
}
