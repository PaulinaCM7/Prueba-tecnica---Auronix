import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom  } from 'rxjs';
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

  private async fetchAllCharacters(url: string): Promise<any[]> {
    const fetchPage = async (
      url: string,
      characters: any[] = [],
    ): Promise<any[]> => {
      const response = await lastValueFrom(this.httpService.get(url));
      if (!response?.data?.results) {
        throw new Error('Formato de datos inesperado');
      }

      const allCharacters = [...characters, ...response.data.results];

      if (response.data.info?.next) {
        return fetchPage(response.data.info.next, allCharacters);
      }

      return allCharacters;
    };

    return fetchPage(url).catch((error) => {
      this.logger.error(`Error al obtener personajes`, error.stack);
      throw new Error('Error al obtener los personajes');
    });
  }

  async getStatusCharacters(status: string) {
    if (!['Alive', 'Dead', 'unknown'].includes(status)) {
      throw new Error('El estado proporcionado no es válido');
    }

    const allCharacters = await this.fetchAllCharacters(
      'https://rickandmortyapi.com/api/character',
    );
    const statusCharacters = allCharacters
      .filter((character: Character) => character.status === status)
      .map((character: Character) => ({
        id: character.id,
        name: character.name.replace(/\s/g, '_'),
        status: character.status,
        gender: character.gender,
      }));
    return {results: statusCharacters};
  }

  async getAllCharacters() {
    const allCharacters = await this.fetchAllCharacters(
      'https://rickandmortyapi.com/api/character',
    );
    return allCharacters.map((character: Character) => ({
      id: character.id,
      name: character.name.replace(/\s/g, '_'),
      status: character.status,
      gender: character.gender,
    }));
  }

  async getTotalCharacters(): Promise<number> {
    try {
      const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/character'));
      if (!response?.data?.info?.count) {
        throw new Error('No se pudo obtener el total de personajes');
      }
      return response.data.info.count;
    } catch (error) {
      this.logger.error('Error al obtener el total de personajes', error.stack);
      throw new Error('Error al obtener el total de personajes');
    }
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