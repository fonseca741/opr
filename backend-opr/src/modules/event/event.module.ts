import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Event,
  EventChairs,
  EventReviewers,
} from 'src/databases/postgres/entities';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Event, EventReviewers, EventChairs]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
