import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleReviewDiscussionDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  @IsNotEmpty()
  isReviwer: boolean;
}
