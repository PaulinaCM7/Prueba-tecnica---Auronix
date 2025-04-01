import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getCharacters() {
    return this.httpService
      .get('https://rickandmortyapi.com/api/character')
      .pipe(
        map((response) => response.data),
        map((data) => ({
          results: data.results
            .filter((character) => character.status === 'Alive')
            .map((character) => ({
              id: character.id,
              name: character.name.replace(/\s/g, '_'),
              status: character.status,
              gender: character.gender,
            })),
        }))
      );
  }
}
