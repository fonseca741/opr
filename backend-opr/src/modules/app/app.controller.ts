import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'Server connected with success!';
  }
}
