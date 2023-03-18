import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ArticleReviewDto {
  @IsString()
  @IsNotEmpty()
  comments: string;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  @IsNumber()
  @IsNotEmpty()
  reviewerId: number;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsString()
  @IsNotEmpty()
  originalFile: string;
}
