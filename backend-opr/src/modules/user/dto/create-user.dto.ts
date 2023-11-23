import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
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
  @IsOptional()
  password: string;

  @IsOptional()
  @OneOf(['author', 'publisher', 'reviewer'])
  role: string;

  @IsOptional()
  isActive: boolean;

  @Match('password')
  @IsOptional()
  passwordConfirmation: string;

  @IsString()
  @IsOptional()
  orcid: string;
}
