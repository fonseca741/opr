import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
} from 'src/databases/postgres/entities/index';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ArticleReview,
      ArticleReviewer,
      ArticleReviewDiscussion,
    ]),
  ],
})
export class ArticleReviewDiscussionModule {}
