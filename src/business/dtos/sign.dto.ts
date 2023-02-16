import { IsString } from 'class-validator';

export class SignDTO {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
