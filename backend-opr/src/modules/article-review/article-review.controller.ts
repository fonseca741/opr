import { Body, Controller, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ArticleReviewService } from './article-review.service';
import { ArticleReviewDto } from './dto';

@Controller('article-review')
export class ArticleReviewController {
  constructor(private readonly articleReviewService: ArticleReviewService) {}

  @Post('review')
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin', 'reviewer'])
  async reviewArticle(@Body() reviewArticleDto: ArticleReviewDto) {
    await this.articleReviewService.review(reviewArticleDto);
  }
}
