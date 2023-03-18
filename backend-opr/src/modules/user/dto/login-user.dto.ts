import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(4)
  @IsNotEmpty()
  password: string;
}
