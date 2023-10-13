import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleReviewDiscussionDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  @IsNotEmpty()
  isReviewer: boolean;

  @IsNumber()
  @IsOptional()
  articleReviewId: number;
}
