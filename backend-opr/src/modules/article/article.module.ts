import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Article,
  ArticleReviewer,
  Event,
  EventArticles,
  EventReviewers,
} from 'src/databases/postgres/entities/index';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Article,
      EventArticles,
      ArticleReviewer,
      EventReviewers,
      Event,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
