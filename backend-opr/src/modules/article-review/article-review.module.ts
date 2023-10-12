import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
} from 'src/databases/postgres/entities/index';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleReviewController } from './article-review.controller';
import { ArticleReviewService } from './article-review.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ArticleReview,
      ArticleReviewer,
      ArticleReviewDiscussion,
    ]),
  ],
  controllers: [ArticleReviewController],
  providers: [ArticleReviewService],
})
export class ArticleReviewModule {}
