import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from './business/services';
import {
  AccountService,
  CustomerService,
  DepositService,
  SecurityService,
  TransferService,
} from './business/services/';
import {
  AccountEntity,
  AccountTypeEntity,
  CustomerEntity,
  DepositEntity,
  DocumentTypeEntity,
  TransferEntity,
} from './data/persistence/entities';
import {
  AccountRepository,
  AccountTypeRepository,
  CustomerRepository,
  DepositRepository,
  DocumentTypeRepository,
  TransferRepository,
} from './data/persistence/repositories/';
import { TypeOrmExceptionFilter } from './data/persistence/utils/exception-filters/typeorm.exception-filters';
import {
  AccountController,
  DepositController,
  SecurityController,
  TransferController,
  UserController,
} from './presentation/controllers/';
import { MiddlewaresMiddleware } from './presentation/middlewares/middlewares.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountTypeEntity,
      CustomerEntity,
      DepositEntity,
      DocumentTypeEntity,
      TransferEntity,
    ]),
  ],
  controllers: [
    UserController,
    TransferController,
    SecurityController,
    DepositController,
    AccountController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
    // TypesOrmPostgresConfigService,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewaresMiddleware).forRoutes('*');
  }
}
