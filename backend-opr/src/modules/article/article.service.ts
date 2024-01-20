import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Article,
  ArticleReviewDiscussion,
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
    @InjectRepository(ArticleReviewDiscussion)
    private readonly articleReviewDiscussion: Repository<ArticleReviewDiscussion>,
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
          subject: '[OpenChair] Novo artefato disponível para revisão!',
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
    const reviews: {
      id: number;
      articlename: string;
      reviewername: string;
      email: string;
    }[] = await this.articleReviewer
      .createQueryBuilder('ar')
      .select('ar2.id, a.name as articleName, u.name as reviewerName, u.email')
      .innerJoin('article_review', 'ar2', 'ar2.articleReviewerId = ar.id')
      .innerJoin('article', 'a', 'a.id = ar.articleId')
      .innerJoin('user', 'u', 'u.id = ar.reviewerId')
      .where('ar."articleId" = :articleId', { articleId: id })
      .getRawMany();

    try {
      for (const review of reviews) {
        await this.articleReviewDiscussion.save({
          articleReview: review.id,
          file: updateArticleDto.file,
          isReviewer: false,
        });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      for (const review of reviews) {
        this.mailService.send({
          to: review.email,
          subject: '[OpenChair] Revisão com novo artefato para analisar.',
          template: MailTemplate.UpdateArticle,
          context: {
            articleName: review.articlename,
            reviewerName: review.reviewername,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
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
      order: {
        articleReviewer: {
          articleReview: { articleDiscussions: { createdAt: 'ASC' } },
        },
      },
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
    return await this.articleReviewer
      .createQueryBuilder('ar')
      .select([
        'a.name as name',
        'a.createdAt as createdAt',
        'a.id as articleId',
        'ar2.id as reviewId',
      ])
      .innerJoin('article_review', 'ar2', 'ar2."articleReviewerId" = ar.id')
      .innerJoin('article', 'a', 'a.id = ar."articleId"')
      .where('ar."reviewerId" = :reviewerId', { reviewerId: id })
      .getRawMany();
  }
}
