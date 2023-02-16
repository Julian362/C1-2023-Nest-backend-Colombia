import { Module } from '@nestjs/common';
import {
  UserController,
  TransferController,
  SecurityController,
  DepositController,
  AccountController,
} from './presentation/controllers/';
import {
  CustomerService,
  TransferService,
  SecurityService,
  AccountService,
  DepositService,
} from './business/services/';
import {
  TransferRepository,
  DepositRepository,
  AccountRepository,
  AccountTypeRepository,
  DocumentTypeRepository,
  CustomerRepository,
} from './data/persistence/repositories/';
import { jwtConstants } from './business/services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    UserController,
    TransferController,
    SecurityController,
    DepositController,
    AccountController,
  ],
  providers: [
    CustomerService,
    TransferService,
    SecurityService,
    DepositService,
    AccountService,
    CustomerRepository,
    TransferRepository,
    DepositRepository,
    AccountRepository,
    AccountTypeRepository,
    DocumentTypeRepository,
  ],
})
export class AppModule {}
