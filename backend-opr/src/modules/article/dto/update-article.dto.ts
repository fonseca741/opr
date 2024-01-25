import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  file: string;

  @IsNumber()
  authorId: number;
}
