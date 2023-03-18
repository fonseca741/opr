import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewer,
} from 'src/databases/postgres/entities';
import { ArticleReviewDto } from './dto';

@Injectable()
export class ArticleReviewService {
  constructor(
    @InjectRepository(ArticleReview)
    private readonly repository: Repository<ArticleReview>,
    @InjectRepository(ArticleReviewer)
    private readonly articleReviewer: Repository<ArticleReviewer>,
  ) {}

  async review(reviewArticleDto: ArticleReviewDto) {
    let articleReviewId = -1;

    const [hasArticleReviewer] = await this.articleReviewer.query(
      `select * from article_reviewer ar where ar."articleId" = ${reviewArticleDto.articleId} and ar."reviewerId" = ${reviewArticleDto.reviewerId}`,
    );

    if (!hasArticleReviewer) {
      const currentArticleReviewer = await this.articleReviewer.save({
        article: reviewArticleDto.articleId,
        reviewer: reviewArticleDto.reviewerId,
      });

      articleReviewId = currentArticleReviewer.id;
    } else {
      articleReviewId = hasArticleReviewer.id;
    }

    await this.repository.save({
      comments: reviewArticleDto.comments,
      articleReview: articleReviewId,
      file: reviewArticleDto.file,
      originalFile: reviewArticleDto.originalFile,
    });
  }
}
