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
export class EventChairs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;

  @Column()
  chair_id: number;

  @ManyToOne(() => Event, (event) => event.eventChairs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne(() => User, (user) => user.chairsEvent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chair_id' })
  chair: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
