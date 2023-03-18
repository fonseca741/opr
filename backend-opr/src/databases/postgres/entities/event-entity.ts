import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User, EventReviewers, EventArticles } from './index';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.creatorEvent)
  creator: any;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  creatorInfos: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventReviewers, (eventReviewers) => eventReviewers.event)
  eventReviewers: EventReviewers;

  @OneToMany(() => EventArticles, (eventArticles) => eventArticles.event)
  eventArticles: EventArticles;
}
