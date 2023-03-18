import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import {
  Article,
  ArticleReviewer,
  EventArticles,
} from 'src/databases/postgres/entities/index';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article, EventArticles, ArticleReviewer]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
