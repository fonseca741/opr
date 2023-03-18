import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Event, EventReviewers } from 'src/databases/postgres/entities';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Event, EventReviewers])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
