import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ArticleReviewDiscussionService } from './article-review-discussion.service';
import { CreateArticleReviewDiscussionDto } from './dto/article-review-discussion.dto';

@Controller('article-review-discussion')
export class ArticleReviewDiscussionController {
  constructor(
    private readonly articleReviewDiscussionService: ArticleReviewDiscussionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async reviewArticle(
    @Body() articleReviewDiscussion: CreateArticleReviewDiscussionDto,
  ) {
    return await this.articleReviewDiscussionService.create(
      articleReviewDiscussion,
    );
  }
}
