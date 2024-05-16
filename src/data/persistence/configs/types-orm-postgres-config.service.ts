import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  AccountEntity,
  AccountTypeEntity,
  CustomerEntity,
  DepositEntity,
  DocumentTypeEntity,
  TransferEntity,
} from '../entities';

@Injectable()
export class TypesOrmPostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [
        AccountTypeEntity,
        AccountEntity,
        CustomerEntity,
        DepositEntity,
        DocumentTypeEntity,
        TransferEntity,
      ],
      synchronize: true,
      // logging: true,
    };
  }
}
