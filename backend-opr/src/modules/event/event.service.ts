import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Event,
  EventChairs,
  EventReviewers,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(EventReviewers)
    private readonly repositoryReviewers: Repository<EventReviewers>,
    @InjectRepository(EventChairs)
    private readonly repositoryChairs: Repository<EventChairs>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = await this.repository.save(createEventDto);

    for (const reviewer of createEventDto.reviewers) {
      await this.repositoryReviewers.save({
        event: event.id,
        reviewer,
      });
    }

    for (const chair of createEventDto.chairs) {
      await this.repositoryChairs.save({
        event: event.id,
        chair,
      });
    }
  }

  async loadAllEvents() {
    return await this.repository.find({
      order: {
        endDate: 'DESC',
      },
    });
  }

  async loadEventById({ id }) {
    return await this.repository.findOne({
      where: {
        id,
      },
      relations: [
        'creator',
        'eventReviewers',
        'eventReviewers.reviewer',
        'eventArticles',
        'eventArticles.article',
        'eventChairs',
        'eventChairs.chair',
      ],
    });
  }

  async loadEventByUserId({ id }) {
    return await this.repository.find({
      where: {
        creator: {
          id,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
