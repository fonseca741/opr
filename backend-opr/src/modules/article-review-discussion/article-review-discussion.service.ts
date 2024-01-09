import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { MailTemplate } from '../mail/constants/mail-template.constants';
import { MailService } from '../mail/mail.service';
import { CreateArticleReviewDiscussionDto } from './dto/article-review-discussion.dto';

@Injectable()
export class ArticleReviewDiscussionService {
  constructor(
    @InjectRepository(ArticleReviewDiscussion)
    private readonly articleReviewDiscussion: Repository<ArticleReviewDiscussion>,
    @InjectRepository(ArticleReview)
    private readonly articleReview: Repository<ArticleReview>,
    private readonly mailService: MailService,
  ) {}

  async create(articleReviewDiscussion: CreateArticleReviewDiscussionDto) {
    const findedReview = await this.articleReview.findBy({
      id: articleReviewDiscussion.articleReviewId,
    });

    if (!findedReview) {
      throw new Error('Article review not found');
    }

    let savedDiscussion = {};

    try {
      savedDiscussion = await this.articleReviewDiscussion.save({
        articleReview: articleReviewDiscussion.articleReviewId,
        ...articleReviewDiscussion,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error on save comment');
    }

    const review = await this.articleReview.findOneBy({
      id: articleReviewDiscussion.articleReviewId,
    });

    const articleName = review.articleReviewer.article.name;
    const articleAuthor = review.articleReviewer.article.creator;
    const reviewer = review.articleReviewer.reviewer;

    await this.mailService.send({
      to: articleReviewDiscussion.isReviewer
        ? articleAuthor.email
        : reviewer.email,
      subject: 'Você recebeu um novo comentário',
      template: MailTemplate.NewDiscussion,
      context: {
        name: articleReviewDiscussion.isReviewer
          ? articleAuthor.name
          : reviewer.name,
        article: articleName,
      },
    });

    return savedDiscussion;
  }
}
