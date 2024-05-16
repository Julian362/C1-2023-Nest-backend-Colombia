import {
  IsEmail,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerUpdateDTO {
  @IsNumberString()
  document: string;

  @IsString()
  @MaxLength(500)
  fullName: string;

  @IsNumberString()
  @MaxLength(30)
  phone: string;

  @Matches(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
  @MinLength(8)
  password: string;
}
