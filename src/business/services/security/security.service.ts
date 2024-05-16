// Libraries
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Repositories
import {
  CustomerRepository,
  DocumentTypeRepository,
} from '../../../data/persistence/repositories';

// Services
import { AccountService } from '../account';

// Entities
import { AccountDTO, CustomerDTO, SignDTO } from 'src/business/dtos';
import { CustomerEntity } from '../../../data/persistence/entities';

@Injectable()
export class SecurityService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly documentTypeRepository: DocumentTypeRepository,
    private readonly accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  /**
   * Identificarse en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  async signIn(user: SignDTO) {
    const answer = await this.customerRepository.findOneByEmailAndPassword(
      user.email,
      user.password,
    );
    if (answer) {
      const customer = await this.customerRepository.findOneByEmail(user.email);
      const payload = { email: customer.email, sub: customer.id };
      return { access_token: this.jwtService.sign(payload), id: customer.id };
    } else throw new UnauthorizedException('Datos de identificación inválidos');
  }

  /**
   * Crear usuario en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  async signUp(user: CustomerDTO) {
    const newCustomer = new CustomerEntity();
    newCustomer.documentType = await this.documentTypeRepository.findOneById(
      user.documentTypeId,
    );
    newCustomer.document = user.document;
    newCustomer.fullName = user.fullName;
    newCustomer.email = user.email;
    newCustomer.phone = user.phone;
    newCustomer.password = user.password;
    if (await this.customerRepository.existEmail(user.email)) {
      throw new NotFoundException(
        `El email ${user.email} ya  existe en base de datos`,
      );
    }

    const customer = await this.customerRepository.register(newCustomer);

    if (customer) {
      const newAccount = new AccountDTO();
      newAccount.customerId = customer.id;
      newAccount.accountTypeId = 'ab27c9ac-a01c-4c22-a6d6-ce5ab3b79185';

      const account = await this.accountService.createAccount(newAccount);
      account.balance = 0;
      if (account) {
        const payload = { email: customer.email, sub: customer.id };
        return {
          access_token: this.jwtService.sign(payload),
          account: account,
        };
      } else
        throw new UnauthorizedException('Datos de identificación inválidos');
    } else throw new InternalServerErrorException();
  }

  /**
   * Salir del sistema
   *
   * @param {string} JWToken
   * @memberof SecurityService
   */
  signOut(JWT: string): boolean {
    if (this.jwtService.verify(JWT)) return true;

    return false;
  }
}
