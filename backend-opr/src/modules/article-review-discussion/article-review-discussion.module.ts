import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
} from 'src/databases/postgres/entities/index';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleReviewDiscussionController } from './article-review-discussion.controller';
import { ArticleReviewDiscussionService } from './article-review-discussion.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ArticleReview,
      ArticleReviewer,
      ArticleReviewDiscussion,
    ]),
  ],
  providers: [ArticleReviewDiscussionService],
  controllers: [ArticleReviewDiscussionController],
})
export class ArticleReviewDiscussionModule {}
