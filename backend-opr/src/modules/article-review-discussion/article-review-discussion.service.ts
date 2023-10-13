import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArticleReview,
  ArticleReviewDiscussion,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { CreateArticleReviewDiscussionDto } from './dto/article-review-discussion.dto';

@Injectable()
export class ArticleReviewDiscussionService {
  constructor(
    @InjectRepository(ArticleReviewDiscussion)
    private readonly articleReviewDiscussion: Repository<ArticleReviewDiscussion>,
    @InjectRepository(ArticleReview)
    private readonly articleReview: Repository<ArticleReview>,
  ) {}

  async create(articleReviewDiscussion: CreateArticleReviewDiscussionDto) {
    const findedReview = await this.articleReview.findBy({
      id: articleReviewDiscussion.articleReviewId,
    });

    if (!findedReview) {
      throw new Error('Article review not found');
    }

    try {
      return await this.articleReviewDiscussion.save({
        articleReview: articleReviewDiscussion.articleReviewId,
        ...articleReviewDiscussion,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error on save comment');
    }
  }
}
