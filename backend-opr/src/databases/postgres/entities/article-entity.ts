import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleReviewer, Event, EventArticles, User } from './index';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.creatorArticle)
  creator: any;

  @ManyToOne(() => Event, (event) => event.eventArticles)
  event: any;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventArticles, (eventArticles) => eventArticles.article)
  articleEvent: EventArticles;

  @OneToMany(
    () => ArticleReviewer,
    (articleReviewer) => articleReviewer.article,
  )
  articleReviewer: ArticleReviewer[];
}
