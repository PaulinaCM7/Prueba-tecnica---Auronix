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

  getStatusCharacters(status: string) {
    if (!['Alive', 'Dead', 'unknown'].includes(status)) {
      throw new Error('El estado proporcionado no es válido');
    }
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
            .filter((character: Character) => character.status === status)
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

  getAllCharacters() {
    return this.httpService
      .get('https://rickandmortyapi.com/api/character')
      .pipe(
        map((response) => {
          if (!response.data?.results) {
            throw new Error('Formato de datos inesperado');
          }
          return response.data.results.map((character: Character) => ({
            id: character.id,
            name: character.name.replace(/\s/g, '_'),
            status: character.status,
            gender: character.gender,
          }));
        }),
        catchError((error) => {
          this.logger.error(`Error al obtener todos los personajes`, error.stack);
          return throwError(() => new Error('Error al obtener los personajes'));
        })
      );
  }

  getCharacterById(id: number) {
    return this.httpService
      .get(`https://rickandmortyapi.com/api/character/${id}`)
      .pipe(
        map((response) => {
          const character = response.data;
          return {
            id: character.id,
            name: character.name.replace(/\s/g, '_'),
            status: character.status,
            gender: character.gender,
          };
        }),
        catchError((error) => {
          this.logger.error(`Error al obtener personaje con ID ${id}`, error.stack);
          return throwError(() => new Error('Error al obtener el personaje'));
        })
      );
  }
}