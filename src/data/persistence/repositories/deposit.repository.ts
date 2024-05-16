import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DepositEntity } from '../entities';
import { DepositRepositoryInterface } from './interfaces/';

@Injectable()
export class DepositRepository implements DepositRepositoryInterface {
  constructor(
    @InjectRepository(DepositEntity)
    private readonly depositRepository: Repository<DepositEntity>,
  ) {}
  register(entity: DepositEntity): Promise<DepositEntity> {
    return this.depositRepository.save(entity);
  }

  update(id: string, entity: DepositEntity): Promise<DepositEntity> {
    return this.depositRepository.update(id, entity).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
      return entity;
    });
  }

  delete(id: string, soft?: boolean): void {
    this.findOneById(id);
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }

  private hardDelete(id: string) {
    this.depositRepository.delete({
      id,
    });
  }

  private softDelete(id: string) {
    let newDeposit = new DepositEntity();
    this.depositRepository
      .findOne({
        where: { id },
      })
      .then((result) => {
        if (result) {
          newDeposit = {
            ...newDeposit,
            ...result,
            id: result.id,
          };
          newDeposit.deletedAt = Date.now();
          this.update(result.id, newDeposit);
        } else {
          throw new NotFoundException(
            `El Id: ${id} no existe en base de datos`,
          );
        }
      });
  }

  findAll(): Promise<DepositEntity[]> {
        return this.depositRepository.find({ where: { deletedAt: undefined }, relations: ['account']});
  }

  async findOneById(id: string): Promise<DepositEntity> {
    return this.depositRepository
      .findOne({
        where: { id, deletedAt: undefined },
        relations: ['account'],
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(`El ID ${id} no existe en base de datos`);
        }
      });
  }

  findByAccountId(accountId: string): Promise<DepositEntity[]> {
    return this.depositRepository.find({
      where: { account: { id: accountId }, deletedAt: undefined },
      relations: ['account'],
    });
  }

  findByDataRange(
    dateInit: Date | number,
    dateEnd: Date | number,
  ): Promise<DepositEntity[]> {
    return this.depositRepository.find({
      where: {
        dateTime: Between(dateInit, dateEnd),
      },
      relations: ['account'],
    });
  }
}
