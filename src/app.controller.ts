import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { lastValueFrom } from 'rxjs';
import { Param } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getDefaultMessage() {
    return { message: 'Server funcionando' };
  }

  @Get('characters/status/:status')
  async getStatusCharacters(@Param('status') status: string) {
    try {
      const characters = await this.appService.getStatusCharacters(status);
      return characters;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('characters/all')
  async getAllCharacters() {
    try {
      const characters = await this.appService.getAllCharacters();
      return characters;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('characters/id/:id')
  async getCharacterById(@Param('id') id: number) {
    const totalCharacters = await this.appService.getTotalCharacters();
    if (id > totalCharacters || id < 1) {
      throw new HttpException('No existe personaje con el id ingresado', HttpStatus.BAD_REQUEST);
    }
    try {
      const character = await lastValueFrom(this.appService.getCharacterById(id));
      return character;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
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
    throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}