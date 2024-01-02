import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Article,
  ArticleReviewer,
  Event,
  EventArticles,
  EventReviewers,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { MailTemplate } from '../mail/constants/mail-template.constants';
import { MailService } from '../mail/mail.service';
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
    @InjectRepository(EventReviewers)
    private readonly eventReviewer: Repository<EventReviewers>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly mailService: MailService,
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

    try {
      const eventReviewers = (
        await this.eventReviewer.findBy({
          event_id: +createArticleDto.event,
        })
      ).map((er) => er.reviewer);

      const eventName = (
        await this.eventRepository.findOneBy({
          id: +createArticleDto.event,
        })
      ).name;

      console.log(eventName);

      eventReviewers.forEach((reviewer) => {
        this.mailService.send({
          to: reviewer.email,
          subject: 'Novo artigo disponível para revisão!',
          template: MailTemplate.NewArticle,
          context: {
            name: reviewer.name,
            article: createArticleDto.name,
            event: eventName,
          },
        });
      });
    } catch (e) {
      console.log(e);
    }
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
