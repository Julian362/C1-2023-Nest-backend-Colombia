import { IsNumberString, IsString, MaxLength } from 'class-validator';

export class TransferDTO {
  @IsNumberString()
  outComeId: string;
  
  @IsNumberString()
  inComeId: string;

  @IsNumberString()
  amount: string;

  @IsString()
  @MaxLength(500)
  reason: string;
}
