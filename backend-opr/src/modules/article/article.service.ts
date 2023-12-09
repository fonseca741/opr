import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Article,
  ArticleReviewer,
  EventArticles,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly repository: Repository<Article>,
    @InjectRepository(EventArticles)
    private readonly repositoryEventArticle: Repository<EventArticles>,
    @InjectRepository(ArticleReviewer)
    private readonly articleReviewer: Repository<ArticleReviewer>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto) {
    const article = await this.repository.save({
      name: createArticleDto.name,
      description: createArticleDto.description,
      creator: createArticleDto.creator,
      file: createArticleDto.file,
      event: createArticleDto.event,
    });

    await this.repositoryEventArticle.save({
      event: createArticleDto.event,
      article: article.id,
    });
  }

  async updateArticle(id, updateArticleDto: UpdateArticleDto) {
    await this.repository.update(id, {
      file: updateArticleDto.file,
    });
  }

  async loadAllArticles() {
    return await this.repository.find({
      relations: ['creator', 'event'],
      order: {
        id: 'DESC',
      },
    });
  }

  async loadArticleById({ id }) {
    return await this.repository.findOne({
      where: {
        id,
      },
      relations: [
        'creator',
        'event',
        'event.eventChairs',
        'articleReviewer',
        'articleReviewer.reviewer',
        'articleReviewer.articleReview',
        'articleReviewer.articleReview.articleDiscussions',
      ],
    });
  }

  async loadArticlesByUserId({ id }) {
    return await this.repository.find({
      where: {
        creator: {
          id: id,
        },
      },
      relations: ['creator'],
      order: {
        id: 'DESC',
      },
    });
  }

  async loadArticleReviewers({ id }) {
    return await this.articleReviewer.find({
      where: {
        reviewer: {
          id: id,
        },
      },
      relations: ['article'],
    });
  }
}
