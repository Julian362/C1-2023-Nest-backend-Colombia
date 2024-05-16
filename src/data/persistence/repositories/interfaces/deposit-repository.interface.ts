import { DepositEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface DepositRepositoryInterface
  extends BaseRepositoryInterface<DepositEntity> {
  findByAccountId(accountId: string): Promise<DepositEntity[]>;
  findByDataRange(
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<DepositEntity[]>;
}
