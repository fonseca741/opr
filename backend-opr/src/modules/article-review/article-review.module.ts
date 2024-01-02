import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Article,
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
  User,
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
      Article,
      User,
    ]),
  ],
  controllers: [ArticleReviewController],
  providers: [ArticleReviewService],
})
export class ArticleReviewModule {}
