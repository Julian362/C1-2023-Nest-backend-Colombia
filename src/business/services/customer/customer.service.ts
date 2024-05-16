import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerDTO } from 'src/business/dtos';
import { CustomerUpdateDTO } from 'src/business/dtos/update-customer.dto';
import {
  AccountEntity,
  CustomerEntity,
  DocumentTypeEntity,
} from '../../../data/persistence/entities';
import {
  AccountRepository,
  AccountTypeRepository,
  CustomerRepository,
} from '../../../data/persistence/repositories';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountRepository: AccountRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  /**
   * Obtener información de un cliente
   *
   * @param {string} customerId
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  async getCustomerInfo(customerId: string): Promise<CustomerEntity> {
    const newCustomer = await this.customerRepository.findOneById(customerId);
    return newCustomer;
  }
  async getCustomerInfoByEmail(email: string): Promise<CustomerEntity> {
    const newCustomer = await this.customerRepository.findOneByEmail(email);
    return newCustomer;
  }

  async findAll(): Promise<CustomerEntity[]> {
    return (await this.customerRepository.findAll()).filter(
      (item) => (item.deletedAt ?? true) === true,
    );
  }
  findAllDeleted(): Promise<CustomerEntity[]> {
    return this.customerRepository.findAllDeleted();
  }

  transform(customer: CustomerDTO): CustomerEntity {
    const documentType = new DocumentTypeEntity();
    documentType.id = customer.documentTypeId;
    const newCustomer = new CustomerEntity();
    newCustomer.documentType = documentType;
    newCustomer.document = customer.document;
    newCustomer.fullName = customer.fullName;
    newCustomer.email = customer.email;
    newCustomer.phone = customer.phone;
    newCustomer.password = customer.password;
    return newCustomer;
  }

  async newCustomer(customer: CustomerDTO): Promise<{
    customer: CustomerEntity;
    account: AccountEntity;
  }> {
    const documentType = new DocumentTypeEntity();
    documentType.id = customer.documentTypeId;

    const newCustomer = new CustomerEntity();
    newCustomer.documentType = documentType;
    newCustomer.document = customer.document;
    newCustomer.fullName = customer.fullName;
    if (await this.customerRepository.existEmail(customer.email)) {
      throw new NotFoundException(
        `El email ${customer.email} ya  existe en base de datos`,
      );
    }
    newCustomer.email = customer.email;
    newCustomer.phone = customer.phone;
    newCustomer.password = customer.password;
    const typeId = 'ab27c9ac-a01c-4c22-a6d6-ce5ab3b79185';
    const account = new AccountEntity();
    account.accountType = await this.accountTypeRepository.findOneById(typeId);
    account.customer = newCustomer;
    return {
      customer: await this.customerRepository.register(newCustomer),
      account: await this.accountRepository.register(account),
    };
  }

  /**
   * Actualizar información de un cliente
   *
   * @param {string} id
   * @param {CustomerModel} customer
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  async updatedCustomer(
    id: string,
    customer: CustomerUpdateDTO,
  ): Promise<CustomerEntity> {
    if (await this.customerRepository.findOneById(id)) {
      const newCustomer = new CustomerEntity();
      newCustomer.document = customer.document;
      newCustomer.fullName = customer.fullName;
      newCustomer.phone = customer.phone;
      newCustomer.password = customer.password;
      return this.customerRepository.update(id, newCustomer);
    }
    return new CustomerEntity();
  }

  /**
   * Dar de baja a un cliente en el sistema
   *
   * @param {string} id
   * @return {*}  {boolean}
   * @memberof CustomerService
   */
  async unsuscribe(id: string): Promise<boolean> {
    if (
      (await this.customerRepository.findOneById(id)).deletedAt === undefined
    ) {
      const customer = await this.customerRepository.findOneById(id);
      customer.state = false;
      this.customerRepository.update(id, customer);
      return true;
    }
    return false;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    if (
      (await this.customerRepository.findOneById(id)).deletedAt === undefined
    ) {
      (await this.accountRepository.findAll()).map(
        (mapa) => (mapa.deletedAt = Date.now()),
      );
      this.customerRepository.delete(id);
      return true;
    }
    return false;
  }
}
