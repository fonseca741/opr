import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article, ArticleReview, User } from './index';

@Entity()
export class ArticleReviewer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.articleReviewer, {
    eager: true,
  })
  article: any;

  @ManyToOne(() => User, (user) => user.articleReviewer, { eager: true })
  reviewer: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => ArticleReview,
    (articleReview) => articleReview.articleReviewer,
  )
  articleReview: ArticleReview;
}
