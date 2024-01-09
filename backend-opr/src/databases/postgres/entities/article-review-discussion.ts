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

  @Column({ nullable: true })
  value?: string;

  @Column()
  isReviewer: boolean;

  @Column({ nullable: true })
  file?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => ArticleReview,
    (articleReview) => articleReview.articleDiscussions,
  )
  articleReview: any;
}
