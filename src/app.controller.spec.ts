import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = module.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Debería retornar un mensaje de "Server funcionando"', () => {
      expect(appController.getDefaultMessage()).toEqual({
        message: 'Server funcionando',
      });
    });
  });

  describe('getAliveCharacters', () => {
    it('Debería retornar un JSON de personajes con el estado "Alive"', async () => {
      const result = await appController.getStatusCharacters('Alive');
      if (!result) {
        throw new Error('El resultado esta indefinido');
      }
      expect(result).toHaveProperty('results');
      expect(result.results.length).toBeGreaterThan(0);

      result.results.forEach((character) => {
        expect(character).toHaveProperty('id');
        expect(typeof character.id).toBe('number');
        expect(character).toHaveProperty('name');
        expect(typeof character.name).toBe('string');
        expect(character.name).toMatch(/^(?:[a-zA-Z0-9]+|[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)$/);
        expect(character).toHaveProperty('status');
        expect(character.status).toBe('Alive');
        expect(character).toHaveProperty('gender');
        expect(['Female', 'Male', 'Genderless', 'unknown']).toContain(character.gender);
      });
    });
  });

  describe('getAllCharacters', () => {
    it('Debería retornar un JSON de personajes con los campos en el formato definido y de todos los estatus', async () => {
      const result = await appController.getAllCharacters();
      if (!result) {
        throw new Error('El resultado esta indefinido');
      }
      expect(result.length).toBeGreaterThan(0);

      result.forEach((character) => {
        expect(character).toHaveProperty('id');
        expect(typeof character.id).toBe('number');
        expect(character).toHaveProperty('name');
        expect(typeof character.name).toBe('string');
        expect(character.name).toMatch(/^(?:[a-zA-Z0-9]+|[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)$/);
        expect(character).toHaveProperty('status');
        expect(['Alive', 'Dead', 'unknown']).toContain(character.status);
        expect(character).toHaveProperty('gender');
        expect(['Female', 'Male', 'Genderless', 'unknown']).toContain(character.gender);
      });
    });
  });

  describe('getCharacterById', () => {
    it('Debería retornar un JSON de un personaje con los campos en el formato definido', async () => {
      const result = await appController.getCharacterById(20);
      if (!result) {
        throw new Error('El resultado esta indefinido');
      }
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('number');
      expect(result).toHaveProperty('name');
      expect(typeof result.name).toBe('string');
      expect(result.name).toMatch(/^(?:[a-zA-Z0-9]+|[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)$/);
      expect(result).toHaveProperty('status');
      expect(['Alive', 'Dead', 'unknown']).toContain(result.status);
      expect(result).toHaveProperty('gender');
      expect(['Female', 'Male', 'Genderless', 'unknown']).toContain(result.gender);
    });
  });
});
