import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  creator: string | number;

  @IsNotEmpty()
  event: string | number;

  @IsNotEmpty()
  file: string;
}
