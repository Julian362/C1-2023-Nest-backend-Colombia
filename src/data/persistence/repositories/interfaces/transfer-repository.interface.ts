import { TransferEntity } from '../../entities';
import { BaseRepositoryInterface } from './base/';

export interface TransferRepositoryInterface
  extends BaseRepositoryInterface<TransferEntity> {
  findAll(): Promise<TransferEntity[]>;
  findOneById(id: string): Promise<TransferEntity>;
  findOutcomeByDataRange(
    accountId: string,
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<TransferEntity[]>;

  findIncomeByDataRange(
    accountId: string,
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<TransferEntity[]>;
}
