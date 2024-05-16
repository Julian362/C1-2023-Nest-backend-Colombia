import { IsNumberString } from 'class-validator';

export class DepositDTO {
  @IsNumberString()
  accountId: string;

  @IsNumberString()
  amount: string;
}
