import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User, Article, ArticleReview } from './index';

@Entity()
export class ArticleReviewer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.articleReviewer)
  article: any;

  @ManyToOne(() => User, (user) => user.articleReviewer)
  reviewer: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => ArticleReview,
    (articleReview) => articleReview.articleReview,
  )
  articleReview: ArticleReview;
}
