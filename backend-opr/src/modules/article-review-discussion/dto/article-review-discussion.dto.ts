import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleReviewDiscussionDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  value?: string;

  @IsBoolean()
  @IsNotEmpty()
  isReviewer: boolean;

  @IsNumber()
  @IsOptional()
  articleReviewId?: number;

  @IsString()
  @IsOptional()
  file?: string;

  @IsNumber()
  creatorId: number;
}
