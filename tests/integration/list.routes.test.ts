import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { buildTestApp } from '../helpers/buildTestApp';
import { FakeTaskListRepository } from '../helpers/FakeTaskListRepository';
import { signAccessToken } from '../../src/shared/utils/jwt';

describe('/api/v1/lists', () => {
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  const ownerToken = signAccessToken(ownerId);
  const otherUserToken = signAccessToken(otherUserId);

  let app: Express;

  beforeEach(() => {
    app = buildTestApp({ taskListRepository: new FakeTaskListRepository() });
  });

  describe('POST /api/v1/lists', () => {
    it('retorna 401 sem token de autenticação', async () => {
      const response = await request(app).post('/api/v1/lists').send({ name: 'Trabalho' });
      expect(response.status).toBe(401);
    });

    it('cria uma lista e retorna 201', async () => {
      const response = await request(app)
        .post('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Trabalho' });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Trabalho');
    });

    it('retorna 400 para nome vazio', async () => {
      const response = await request(app)
        .post('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
    });

    it('retorna 409 para nome duplicado do mesmo usuário', async () => {
      await request(app)
        .post('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Trabalho' });

      const response = await request(app)
        .post('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Trabalho' });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/v1/lists', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Trabalho' });
    });

    it('lista as listas do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/v1/lists')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('não retorna listas de outro usuário (controle de acesso)', async () => {
      const response = await request(app)
        .get('/api/v1/lists')
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});
