import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { ArticleReviewDto } from './dto';

@Injectable()
export class ArticleReviewService {
  constructor(
    @InjectRepository(ArticleReview)
    private readonly repository: Repository<ArticleReview>,
    @InjectRepository(ArticleReviewer)
    private readonly articleReviewer: Repository<ArticleReviewer>,
    @InjectRepository(ArticleReviewDiscussion)
    private readonly articleReviewDiscussion: Repository<ArticleReviewDiscussion>,
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

    try {
      const review = await this.repository.save({
        articleReviewer: articleReviewId,
        file: reviewArticleDto.file,
        originalFile: reviewArticleDto.originalFile,
      });

      console.log(review);
      await this.articleReviewDiscussion.save({
        articleReview: review.id,
        value: reviewArticleDto.discussion.value,
        isReviwer: reviewArticleDto.discussion.isReviwer,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
