import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventChairs } from './event-chairs-entity';
import {
  Article,
  ArticleReviewDiscussion,
  ArticleReviewer,
  Event,
  EventReviewers,
} from './index';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'author', 'publisher', 'reviewer'],
    default: 'author',
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  orcid: string;

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

  @OneToMany(() => EventChairs, (eventChairs) => eventChairs.chair)
  chairsEvent: EventReviewers;

  @OneToMany(() => ArticleReviewDiscussion, (discussion) => discussion.creator)
  articleReviewDiscussions: ArticleReviewDiscussion[];

  @BeforeInsert()
  hashPassword = async () => {
    if (this.password) this.password = await hash(this.password, 10);
  };

  async checkPassword(password: string) {
    return await compare(password, this.password);
  }
}
