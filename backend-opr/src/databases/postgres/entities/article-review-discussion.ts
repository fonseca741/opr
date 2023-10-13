import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleReview } from './index';

@Entity()
export class ArticleReviewDiscussion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  isReviewer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => ArticleReview,
    (articleReview) => articleReview.articleDiscussions,
  )
  articleReview: any;
}
