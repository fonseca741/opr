import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/env';
import {
  Article,
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
  Event,
  EventArticles,
  EventChairs,
  EventReviewers,
  User,
} from 'src/databases/postgres/entities';
import { ArticleReviewModule } from 'src/modules/article-review/article-review.module';
import { ArticleModule } from 'src/modules/article/article.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventModule } from 'src/modules/event/event.module';
import { UserModule } from 'src/modules/user/user.module';
import { ArticleReviewDiscussionModule } from '../article-review-discussion/article-review-discussion.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      ssl: false,
      entities: [
        User,
        Article,
        ArticleReview,
        ArticleReviewer,
        Event,
        EventArticles,
        EventReviewers,
        ArticleReviewDiscussion,
        EventChairs,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    EventModule,
    ArticleModule,
    ArticleReviewModule,
    ArticleReviewDiscussionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
