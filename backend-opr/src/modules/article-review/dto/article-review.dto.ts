import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateArticleReviewDiscussionDto } from 'src/modules/article-review-discussion/dto/article-review-discussion.dto';

export class ArticleReviewDto {
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

  @IsNotEmpty()
  discussion: CreateArticleReviewDiscussionDto;
}
