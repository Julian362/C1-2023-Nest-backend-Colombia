import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeEntity } from '../entities/account-type.entity';
import { AccountTypeRepositoryInterface } from './interfaces/';
@Injectable()
export class AccountTypeRepository implements AccountTypeRepositoryInterface {
  constructor(
    @InjectRepository(AccountTypeEntity)
    private readonly userRepository: Repository<AccountTypeEntity>,
  ) {
    this.register({
      id: 'ab27c9ac-a01c-4c22-a6d6-ce5ab3b79185',
      name: 'Cuenta de ahorros',
      state: true,
    });

    this.register({
      id: '10b6c590-85fa-4621-b85a-4021e882c080',
      name: 'Cuenta corriente',
      state: true,
    });
  }
  findAll(): Promise<AccountTypeEntity[]> {
    return this.userRepository.find();
  }

  register(entity: AccountTypeEntity): Promise<AccountTypeEntity> {
    return this.userRepository.save(entity);
  }

  async update(
    id: string,
    entity: AccountTypeEntity,
  ): Promise<AccountTypeEntity> {
    return this.userRepository.update(id, entity).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
      return entity;
    });
  }

  delete(id: string): void {
    this.userRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
    });
  }

  async findOneById(id: string): Promise<AccountTypeEntity> {
    return this.userRepository
      .findOne({
        where: { id },
      })
      ?.then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(
            `El Id: ${id} no existe en base de datos`,
          );
        }
      });
  }

  findByState(state: boolean): Promise<AccountTypeEntity[]> {
    return this.userRepository.find({ where: { state } });
  }

  findByName(name: string): Promise<AccountTypeEntity[]> {
    return this.userRepository.find({ where: { name } });
  }
}
