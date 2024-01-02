import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleReviewDiscussion } from './article-review-discussion';
import { ArticleReviewer } from './index';

@Entity()
export class ArticleReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ArticleReviewer,
    (articleReviewer) => articleReviewer.articleReview,
    { eager: true },
  )
  articleReviewer: any;

  @Column()
  file: string;

  @Column()
  originalFile: string;

  @OneToMany(
    () => ArticleReviewDiscussion,
    (articleReviewDiscussion) => articleReviewDiscussion.articleReview,
  )
  articleDiscussions: ArticleReviewDiscussion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
