import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getCharacters() {
    const characters = await this.appService.getCharacters();
    return characters;
  }

}
