import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Event,
  EventChairs,
  EventReviewers,
} from 'src/databases/postgres/entities';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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
        event_id: event.id,
        reviewer,
      });
    }

    for (const chair of createEventDto.chairs) {
      await this.repositoryChairs.save({
        event_id: event.id,
        chair_id: chair,
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

  async update(updateEventDto: UpdateEventDto) {
    const { chairs, reviewers, ...updateData } = updateEventDto;

    await this.repository.update({ id: updateEventDto.id }, updateData);

    console.log(updateEventDto.id);

    const oldChairs = await this.repositoryChairs.findBy({
      event_id: updateEventDto.id,
    });

    const oldReviewers = await this.repositoryReviewers.findBy({
      event_id: updateEventDto.id,
    });

    await this.repositoryChairs.remove(oldChairs);
    await this.repositoryReviewers.remove(oldReviewers);

    for (const reviewer of updateEventDto.reviewers) {
      await this.repositoryReviewers.save({
        event_id: updateEventDto.id,
        reviewer,
      });
    }

    for (const chair of updateEventDto.chairs) {
      await this.repositoryChairs.save({
        event_id: updateEventDto.id,
        chair_id: chair,
      });
    }
  }
}
