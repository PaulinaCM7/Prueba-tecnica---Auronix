import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private httpService: HttpService) {}

  getCharacters() {
    return this.httpService
      .get('https://rickandmortyapi.com/api/character')
      .pipe(
        map((response) => {
          if (!response.data?.results) {
            throw new Error('Formato de datos inesperado');
          }
          return response.data;
        }),
        map((data) => ({
          results: data.results
            .filter((character: Character) => character.status === 'Alive')
            .map((character: Character) => ({
              id: character.id,
              name: character.name.replace(/\s/g, '_'),
              status: character.status,
              gender: character.gender,
            })),
        })),
        catchError((error) => {
          this.logger.error(`Error al obtener personajes`, error.stack);
          this.logger.debug('Detalles del error:', JSON.stringify({
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          }));
          return throwError(() => new Error('Error al obtener los personajes'));
        })
      );
  }
}