import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventChairs } from './event-chairs-entity';
import { EventArticles, EventReviewers, User } from './index';

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

  @OneToMany(() => EventChairs, (eventChairs) => eventChairs.event)
  eventChairs: EventChairs;

  @OneToMany(() => EventArticles, (eventArticles) => eventArticles.event)
  eventArticles: EventArticles;
}
