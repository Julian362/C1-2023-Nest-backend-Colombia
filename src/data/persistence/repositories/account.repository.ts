import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities';
import { AccountRepositoryInterface } from './interfaces/';

@Injectable()
export class AccountRepository implements AccountRepositoryInterface {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly userRepository: Repository<AccountEntity>,
  ) {}

  register(entity: AccountEntity): Promise<AccountEntity> {
    return this.userRepository.save(entity);
  }

  async update(id: string, entity: AccountEntity): Promise<AccountEntity> {
    return this.userRepository.update(id, entity).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
      return entity;
    });
  }

  findOneById(id: string): Promise<AccountEntity> {
    const deletedAt = undefined;
    return this.userRepository
      .findOne({
        where: { id, deletedAt },
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

  delete(id: string, soft?: boolean): void {
    this.findOneById(id);
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }

  private hardDelete(id: string): void {
    this.userRepository.delete(id);
  }

  private async softDelete(id: string) {
    let newAccount = new AccountEntity();
    const account = await this.findOneById(id);
    newAccount = {
      ...newAccount,
      ...account,
      id: account.id,
    };
    newAccount.deletedAt = Date.now();
    this.update(account.id, newAccount);
  }

  findAll(): Promise<AccountEntity[]> {
    const deletedAt = undefined;
    return this.userRepository.find({
      where: { deletedAt },
    });
  }

  findByState(state: boolean): Promise<AccountEntity[]> {
    const deletedAt = undefined;
    return this.userRepository.find({ where: { state, deletedAt } });
  }

  findByCustomer(customerId: string): Promise<AccountEntity[]> {
    const deletedAt = undefined;
    return this.userRepository.find({
      where: { customer: { id: customerId }, deletedAt },
      relations: [
        'accountType',
      ],
    });
  }

  findByAccountType(accountTypeId: string): Promise<AccountEntity[]> {
    const deletedAt = undefined;
    return this.userRepository.find({
      where: { accountType: { id: accountTypeId }, deletedAt },
    });
  }
}
