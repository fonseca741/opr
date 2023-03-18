import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Match, OneOf } from 'src/decorators';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(4)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @OneOf(['author', 'publisher', 'reviewer'])
  role: string;

  @IsOptional()
  isActive: boolean;

  @Match('password')
  passwordConfirmation: string;
}
