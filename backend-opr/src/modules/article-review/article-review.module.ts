import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleReviewService } from './article-review.service';
import { ArticleReviewController } from './article-review.controller';
import {
  ArticleReview,
  ArticleReviewer,
} from 'src/databases/postgres/entities/index';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ArticleReview, ArticleReviewer]),
  ],
  controllers: [ArticleReviewController],
  providers: [ArticleReviewService],
})
export class ArticleReviewModule {}
