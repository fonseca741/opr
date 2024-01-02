import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event, User } from './index';

@Entity()
export class EventReviewers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;

  @ManyToOne(() => Event, (event) => event.eventReviewers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne(() => User, (user) => user.reviewerEvent, { eager: true })
  reviewer: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
