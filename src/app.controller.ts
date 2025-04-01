import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  async getCharacters() {
    try {
      const characters = await lastValueFrom(this.appService.getCharacters());
      return characters;
    } catch (error) {
      if (error.response?.status === 404) {
        this.logger.error('Personajes no encontrados');
        throw new HttpException('Personajes no encontrados', HttpStatus.NOT_FOUND);
      }
      this.logger.error('Error en AppController', error.stack);
      this.logger.debug('Detalles del error:', JSON.stringify({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      }));
      throw new HttpException('Error interno del servidor',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}