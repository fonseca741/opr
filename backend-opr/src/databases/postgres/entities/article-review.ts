import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { ArticleReviewer } from './index';

@Entity()
export class ArticleReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ArticleReviewer,
    (articleReviewer) => articleReviewer.articleReview,
  )
  articleReview: any;

  @Column()
  file: string;

  @Column()
  originalFile: string;

  @Column()
  comments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
