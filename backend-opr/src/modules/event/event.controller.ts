import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin', 'publisher'])
  async create(@Body() createEventDto: CreateEventDto) {
    await this.eventService.create(createEventDto);
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(@Body() updateEventDto: UpdateEventDto) {
    await this.eventService.update(updateEventDto);
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
