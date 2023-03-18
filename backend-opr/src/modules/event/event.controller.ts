import {
  Controller,
  Post,
  Body,
  SetMetadata,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin', 'publisher'])
  async create(@Body() createEventDto: CreateEventDto) {
    await this.eventService.create(createEventDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async loadAllEvents() {
    return await this.eventService.loadAllEvents();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async loadEventById(@Param() { id }) {
    return await this.eventService.loadEventById({ id });
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async loadEventByUserId(@Param() { id }) {
    return await this.eventService.loadEventByUserId({ id });
  }
}
