import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Article,
  ArticleReview,
  ArticleReviewDiscussion,
  ArticleReviewer,
  User,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { MailTemplate } from '../mail/constants/mail-template.constants';
import { MailService } from '../mail/mail.service';
import { ArticleReviewDto } from './dto';

@Injectable()
export class ArticleReviewService {
  constructor(
    @InjectRepository(ArticleReview)
    private readonly repository: Repository<ArticleReview>,
    @InjectRepository(ArticleReviewer)
    private readonly articleReviewer: Repository<ArticleReviewer>,
    @InjectRepository(ArticleReviewDiscussion)
    private readonly articleReviewDiscussion: Repository<ArticleReviewDiscussion>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async review(reviewArticleDto: ArticleReviewDto) {
    let articleReviewId = -1;

    const [hasArticleReviewer] = await this.articleReviewer.query(
      `select * from article_reviewer ar where ar."articleId" = ${reviewArticleDto.articleId} and ar."reviewerId" = ${reviewArticleDto.reviewerId}`,
    );

    if (!hasArticleReviewer) {
      const currentArticleReviewer = await this.articleReviewer.save({
        article: reviewArticleDto.articleId,
        reviewer: reviewArticleDto.reviewerId,
      });

      articleReviewId = currentArticleReviewer.id;
    } else {
      articleReviewId = hasArticleReviewer.id;
    }

    const article = await this.articleRepository.findOneBy({
      id: reviewArticleDto.articleId,
    });

    const reviewer = await this.userRepository.findOneBy({
      id: reviewArticleDto.reviewerId,
    });

    try {
      const review = await this.repository.save({
        articleReviewer: articleReviewId,
        file: reviewArticleDto.file,
        originalFile: reviewArticleDto.originalFile,
      });
      await this.articleReviewDiscussion.save({
        articleReview: review.id,
        value: reviewArticleDto.discussion.value,
        isReviewer: reviewArticleDto.discussion.isReviewer,
      });
      await this.mailService.send({
        to: article.creator.email,
        subject: '[OpenChair] Você recebeu uma nova revisão!',
        template: MailTemplate.NewReview,
        context: {
          name: article.creator.name,
          reviewer: reviewer.name,
          article: article.name,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error on save review');
    }
  }
}
