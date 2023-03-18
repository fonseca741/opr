import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventReviewers } from 'src/databases/postgres/entities';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(EventReviewers)
    private readonly repositoryReviewers: Repository<EventReviewers>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = await this.repository.save(createEventDto);

    for (const reviewer of createEventDto.reviewers) {
      await this.repositoryReviewers.save({
        event: event.id,
        reviewer,
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
