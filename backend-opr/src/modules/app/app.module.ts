import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/env';
import { AppController } from './app.controller';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventModule } from 'src/modules/event/event.module';
import { ArticleModule } from 'src/modules/article/article.module';
import { ArticleReviewModule } from 'src/modules/article-review/article-review.module';
import {
  User,
  Article,
  Event,
  ArticleReviewer,
  ArticleReview,
  EventArticles,
  EventReviewers,
} from 'src/databases/postgres/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      ssl: true,
      entities: [
        User,
        Article,
        ArticleReview,
        ArticleReviewer,
        Event,
        EventArticles,
        EventReviewers,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    EventModule,
    ArticleModule,
    ArticleReviewModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
