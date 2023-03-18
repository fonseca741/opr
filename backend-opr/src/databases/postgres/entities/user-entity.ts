import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hash, compare } from 'bcrypt';
import { Event, EventReviewers, Article, ArticleReviewer } from './index';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'author', 'publisher', 'reviewer'],
    default: 'author',
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Event, (event) => event.creator)
  creatorEvent: Event;

  @OneToMany(() => Article, (creatorArticle) => creatorArticle.creator)
  creatorArticle: Article;

  @OneToMany(
    () => ArticleReviewer,
    (articleReviewer) => articleReviewer.reviewer,
  )
  articleReviewer: ArticleReviewer;

  @OneToMany(() => EventReviewers, (eventReviewers) => eventReviewers.reviewer)
  reviewerEvent: EventReviewers;

  @BeforeInsert()
  hashPassword = async () => {
    this.password = await hash(this.password, 10);
  };

  async checkPassword(password: string) {
    return await compare(password, this.password);
  }
}
