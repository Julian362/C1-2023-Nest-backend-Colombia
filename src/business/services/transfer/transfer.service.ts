import { Injectable, NotFoundException } from '@nestjs/common';
import { TransferDTO } from 'src/business/dtos';
import {
  DataRangeModel,
  PaginationModel,
  TransferModel
} from '../../../data/models';
import { TransferEntity } from '../../../data/persistence/entities';
import {
  AccountRepository,
  DepositRepository,
  TransferRepository
} from '../../../data/persistence/repositories';
@Injectable()
export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly accountRepository: AccountRepository,
    private readonly depositRepository: DepositRepository,
  ) {}
  /**
   * Crear una transferencia entre cuentas del banco
   *
   * @param {TransferModel} transfer
   * @return {*}  {TransferEntity}
   * @memberof TransferService
   */
  async createTransfer(transfer: TransferDTO): Promise<TransferModel> {
    const newTransfer = new TransferEntity();
    const inCome = await this.accountRepository.findOneById(transfer.inComeId);
    const outCome = await this.accountRepository.findOneById(
      transfer.outComeId,
    );
    if (outCome.balance > Number(transfer.amount)) {
      newTransfer.inCome = inCome;
      newTransfer.outCome = outCome;
      newTransfer.amount = Number(transfer.amount);
      newTransfer.reason = transfer.reason;
      outCome.balance = Number(outCome.balance) - Number(transfer.amount);
      this.accountRepository.update(outCome.id, outCome);
      this.accountRepository.update(outCome.id, outCome);
      inCome.balance = Number(inCome.balance) +Number(transfer.amount);
      this.accountRepository.update(inCome.id, inCome);
      newTransfer.dateTime = Date.now();
      return this.transferRepository.register(newTransfer);
    } else {
      throw new NotFoundException(`fondos insuficientes`);
    }
  }

  /**
   * Obtener historial de transacciones de salida de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  async getHistoryOut(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): Promise<TransferEntity[]> {
    if (dataRange) {
      const array = (
        await this.transferRepository.findOutcomeByDataRange(
          accountId,
          dataRange.startDate ?? 0,
          dataRange.endDate ?? Date.now(),
        )
      ).filter(
        (item) =>
          item.outCome.id === accountId &&
          item.amount > (dataRange.startAmount ?? 0) &&
          item.amount < (dataRange.endAmount ?? Number.MAX_SAFE_INTEGER),
      );
      return array.slice(
        pagination.length * pagination.page,
        pagination.length * pagination.page + pagination.length,
      );
    }
    return [];
  }

  /**
   * Obtener historial de transacciones de entrada en una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  async getHistoryIn(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): Promise<TransferEntity[]> {
    if (dataRange) {
      const array = (
        await this.transferRepository.findIncomeByDataRange(
          accountId,
          dataRange.startDate ?? 0,
          dataRange.endDate ?? Date.now(),
        )
      ).filter(
        (item) =>
          item.inCome.id === accountId &&
          item.amount > (dataRange.startAmount ?? 0) &&
          item.amount < (dataRange.endAmount ?? Number.MAX_SAFE_INTEGER),
      );
      return array.slice(
        pagination.length * pagination.page,
        pagination.length * pagination.page + pagination.length,
      );
    }
    return [];
  }

  /**
   * Obtener historial de transacciones de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  async getHistory(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): Promise<TransferEntity[]> {
    if (dataRange) {
      const newArray = this.transferRepository.findByDataRange(
        dataRange.startDate ?? 0,
        dataRange.endDate ?? Date.now(),
      );
      const array = (await newArray).filter(
        (item) =>
          (item.inCome.id === accountId || item.outCome.id === accountId) &&
          (item.amount >= Number(dataRange.startAmount) ?? 0) &&
          (item.amount <= Number(dataRange.endAmount) ?? Number.MAX_VALUE),
      );
      return array.slice(
        pagination.length * pagination.page,
        pagination.length * pagination.page + pagination.length,
      );
    }
    const start = pagination.length * pagination.page;
    const end = start + Number(pagination.length);
    const array = (await this.transferRepository.findAll())
      .filter(
        (item) => item.inCome.id === accountId || item.outCome.id === accountId,
      )
      .slice(start, end);
    return array;
  }

  /**
   * Borrar una transacción
   *
   * @param {string} transferId
   * @memberof TransferService
   */
  deleteTransfer(transferId: string): void {
    this.transferRepository.delete(transferId);
  }

  async selectTransfer(transferId: string): Promise<TransferEntity> {
    return await this.transferRepository.findOneById(transferId);
  }
}
