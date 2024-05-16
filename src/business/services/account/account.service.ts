import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { AccountDTO } from 'src/business/dtos';
import {
  AccountEntity,
  AccountTypeEntity,
} from '../../../data/persistence/entities';
import {
  AccountRepository,
  AccountTypeRepository,
  CustomerRepository,
} from '../../../data/persistence/repositories';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  /**
   * Crear una cuenta
   *
   * @param {AccountModel} account
   * @return {*}  {AccountEntity}
   * @memberof AccountService
   */
  async createAccount(account: AccountDTO): Promise<AccountEntity> {
    const newAccount = new AccountEntity();
    newAccount.customer = await this.customerRepository.findOneById(
      account.customerId,
    );
    newAccount.accountType = await this.accountTypeRepository.findOneById(
      account.accountTypeId,
    );
    return this.accountRepository.register(newAccount);
  }

  async CustomerBalance(id: string): Promise<boolean> {
    const array = (await this.accountRepository.findAll()).filter(
      (user) => user.customer.id === id && user.balance > 0,
    );
    return array.length <= 0;
  }

  /**
   * Obtener el balance de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  async getBalance(accountId: string): Promise<number> {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    return newAccount.balance;
  }

  async getAccountByCustomerId(customerId: string): Promise<AccountEntity[]> {
    return await this.accountRepository.findByCustomer(customerId);
  }

  async findAll(): Promise<AccountEntity[]> {
    return await this.accountRepository.findAll();
  }

  /**
   * Agregar balance a una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  async addBalance(accountId: string, amount: number) {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    newAccount.balance += amount;
    this.accountRepository.update(accountId, newAccount);
  }

  /**
   * Remover balance de una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  async removeBalance(accountId: string, amount: number) {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    if (await this.verifyAmountIntoBalance(accountId, amount)) {
      let newAccount = new AccountEntity();
      newAccount = await this.accountRepository.findOneById(accountId);
      newAccount.balance -= Number(amount);
      this.accountRepository.update(accountId, newAccount);
    }
  }

  /**
   * Verificar la disponibilidad de un monto a retirar en una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  async verifyAmountIntoBalance(
    accountId: string,
    amount: number,
  ): Promise<boolean> {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    if (newAccount.balance < amount) {
      return false;
    }
    return true;
  }

  /**
   * Obtener el estado de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  async getState(accountId: string): Promise<boolean> {
    return (await this.accountRepository.findOneById(accountId)).state;
  }

  /**
   * Cambiar el estado de una cuenta
   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  async changeState(accountId: string, state: boolean) {
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    newAccount.state = state;
    this.accountRepository.update(accountId, newAccount);
  }

  /**
   * Obtener el tipo de cuenta de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  async getAccountType(accountId: string): Promise<AccountTypeEntity> {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    const AccountTypeEntity = newAccount.accountType;
    return AccountTypeEntity;
  }

  /**
   * Cambiar el tipo de cuenta a una cuenta
   *
   * @param {string} accountId
   * @param {string} accountTypeId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  async changeAccountType(
    accountId: string,
    accountTypeId: string,
  ): Promise<AccountTypeEntity> {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = await this.accountRepository.findOneById(accountId);
    const accountType = await this.accountTypeRepository.findOneById(
      accountTypeId,
    );
    newAccount.accountType = accountType;

    return (await this.accountRepository.update(accountId, newAccount))
      .accountType;
  }

  /**
   * Borrar una cuenta
   *
   * @param {string} accountId
   * @memberof AccountService
   */
  deleteAccount(accountId: string): void {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    this.accountRepository.delete(accountId);
  }
}
