import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleReview, User } from './index';

@Entity()
export class ArticleReviewDiscussion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  value?: string;

  @Column()
  isReviewer: boolean;

  @Column()
  creatorId: number;

  @Column({ nullable: true })
  file?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => ArticleReview,
    (articleReview) => articleReview.articleDiscussions,
  )
  articleReview: any;

  @ManyToOne(() => User, (user) => user.articleReviewDiscussions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'creatorId' })
  creator: any;
}
