import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TransferEntity } from '../entities';
import { TransferRepositoryInterface } from './interfaces';

@Injectable()
export class TransferRepository implements TransferRepositoryInterface {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,
  ) {}
  register(entity: TransferEntity): Promise<TransferEntity> {
    return this.transferRepository.save(entity);
  }

  update(id: string, entity: TransferEntity): Promise<TransferEntity> {
    return this.transferRepository.update(id, entity).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
      return entity;
    });
  }

  delete(id: string, soft?: boolean) {
    this.findOneById(id);
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }

  private hardDelete(id: string) {
    this.transferRepository.delete({
      id,
    });
  }

  private async softDelete(id: string) {
    let newTransfer = new TransferEntity();
    const transfer = await this.transferRepository
      .findOne({
        where: { id },
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(
            `El Id: ${id} no existe en base de datos`,
          );
        }
      });
    newTransfer = {
      ...newTransfer,
      ...transfer,
      id: transfer.id,
    };
    newTransfer.deletedAt = Date.now();
    this.update(transfer.id, newTransfer);
  }

  findAll(): Promise<TransferEntity[]> {
    return this.transferRepository.find({
      where: { deletedAt: undefined },
    });
  }

  async findOneById(id: string): Promise<TransferEntity> {
    return this.transferRepository
      .findOne({
        where: { id, deletedAt: undefined },
        relations: ['inCome', 'outCome'],
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(
            `El Id: ${id} no existe en base de datos`,
          );
        }
      });
  }

  findOutcomeByDataRange(
    accountId: string,
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<TransferEntity[]> {
    return this.transferRepository.find({
      where: {
        dateTime: Between(dateInit, dateEnd),
        outCome: { id: accountId },
        
      },
      relations: ['inCome', 'outCome'],
    });
  }

  findIncomeByDataRange(
    accountId: string,
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<TransferEntity[]> {
    return this.transferRepository.find({
      where: {
        dateTime: Between(dateInit, dateEnd),
        inCome: { id: accountId },
      },
      relations: ['inCome', 'outCome'],

    });
  }

  findByDataRange(
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<TransferEntity[]> {
    return this.transferRepository.find({
      where: {
        dateTime: Between(dateInit, dateEnd),
      },
      relations: ['inCome', 'outCome'],

    });
  }
}
