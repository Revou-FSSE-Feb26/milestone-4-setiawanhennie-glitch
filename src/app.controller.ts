import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'FinTrack API is running!',
      version: '1.0.0',
    };
  }
}