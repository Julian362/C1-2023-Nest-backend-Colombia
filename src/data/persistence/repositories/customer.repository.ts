import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities';
import { CustomerRepositoryInterface } from './interfaces/';

@Injectable()
export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  register(entity: CustomerEntity): Promise<CustomerEntity> {
    console.log(entity)
    return this.customerRepository.save(entity);
  }

  async update(id: string, entity: CustomerEntity): Promise<CustomerEntity> {
    return this.customerRepository.update(id, entity).then((result) => {
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

  private hardDelete(id: string): void {
    this.customerRepository.delete(id);
  }

  private async softDelete(id: string) {
    let newCustomer = new CustomerEntity();
    const customer = await this.customerRepository
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
    newCustomer = {
      ...newCustomer,
      ...customer,
      id: customer.id,
    };
    newCustomer.deletedAt = Date.now();
    this.update(customer.id, newCustomer);
  }

  findAll(): Promise<CustomerEntity[]> {
    const deletedAt = undefined;
    return this.customerRepository.find({ where: { deletedAt } });
  }
  findAllDeleted(): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      where: { deletedAt: undefined },
    });
  }

  async findOneById(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { id, deletedAt: undefined },
    });
    if (customer) return customer;
    else throw new NotFoundException(`El ID ${id} no existe en base de datos`);
  }

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    return this.customerRepository
      .find({
        where: { email, password, deletedAt: undefined },
      })
      .then((result) => {
        if (result.length > 0) {
          return true;
        } else {
          return false;
        }
      });
  }

  async findOneByDocumentTypeAndDocument(
    documentTypeId: string,
    document: string,
  ): Promise<CustomerEntity> {
    const result = await this.customerRepository.findOne({
      where: {
        documentType: { id: documentTypeId },
        document,
        deletedAt: undefined,
      },
    });
    if (result) {
      return result;
    } else {
      throw new NotFoundException(`no existe en base de datos`);
    }
  }

  async findOneByEmail(email: string): Promise<CustomerEntity> {
    return this.customerRepository
      .findOne({
        where: { email, deletedAt: undefined },
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(`no existe en base de datos`);
        }
      });
  }
  async existEmail(email: string): Promise<boolean> {
    return this.customerRepository
      .find({
        where: { email, deletedAt: undefined },
      })
      .then((result) => {
        if (result.length > 0) {
          return true;
        } else {
          return false;
        }
      });
  }

  async findOneByPhone(phone: string): Promise<CustomerEntity> {
    return this.customerRepository
      .findOne({
        where: { phone, deletedAt: undefined },
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(`no existe en base de datos`);
        }
      });
  }

  findByState(state: boolean): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      where: { state, deletedAt: undefined },
    });
  }

  findByFullName(fullName: string): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      where: { fullName, deletedAt: undefined },
    });
  }
}
