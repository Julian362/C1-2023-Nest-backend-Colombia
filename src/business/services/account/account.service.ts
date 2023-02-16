import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import {
  AccountEntity,
  AccountTypeEntity,
} from '../../../data/persistence/entities';
import { AccountDTO } from 'src/business/dtos';
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
  createAccount(account: AccountDTO): AccountEntity {
    const newAccount = new AccountEntity();
    newAccount.customer = this.customerRepository.findOneById(
      account.customerId,
    );
    newAccount.accountType = this.accountTypeRepository.findOneById(
      account.accountTypeId,
    );
    return this.accountRepository.register(newAccount);
  }

  /**
   * Obtener el balance de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  getBalance(accountId: string): number {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
    return newAccount.balance;
  }

  getAccountByCustomerId(customerId: string): AccountEntity[] {
    return this.accountRepository.findByCustomer(customerId);
  }

  findAll(): AccountEntity[] {
    return this.accountRepository.findAll();
  }

  /**
   * Agregar balance a una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  addBalance(accountId: string, amount: number): void {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
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
  removeBalance(accountId: string, amount: number): void {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    if (this.verifyAmountIntoBalance(accountId, amount)) {
      let newAccount = new AccountEntity();
      newAccount = this.accountRepository.findOneById(accountId);
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
  verifyAmountIntoBalance(accountId: string, amount: number): boolean {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
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
  getState(accountId: string): boolean {
    return this.accountRepository.findOneById(accountId).state;
  }

  /**
   * Cambiar el estado de una cuenta
   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  changeState(accountId: string, state: boolean): void {
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
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
  getAccountType(accountId: string): AccountTypeEntity {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
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
  changeAccountType(
    accountId: string,
    accountTypeId: string,
  ): AccountTypeEntity {
    if (!this.getState(accountId)) {
      throw new ConflictException(`Cuenta desactivada`);
    }
    let newAccount = new AccountEntity();
    newAccount = this.accountRepository.findOneById(accountId);
    const accountType = this.accountTypeRepository.findOneById(accountTypeId);
    newAccount.accountType = accountType;

    return this.accountRepository.update(accountId, newAccount).accountType;
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
