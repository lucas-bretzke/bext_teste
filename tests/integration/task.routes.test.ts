import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { buildTestApp } from '../helpers/buildTestApp';
import { FakeTaskListRepository } from '../helpers/FakeTaskListRepository';
import { FakeTaskRepository } from '../helpers/FakeTaskRepository';
import { buildTaskList } from '../helpers/factories';
import { signAccessToken } from '../../src/shared/utils/jwt';

describe('/api/v1/tasks', () => {
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  const ownerToken = signAccessToken(ownerId);
  const otherUserToken = signAccessToken(otherUserId);

  let app: Express;
  let ownedList: ReturnType<typeof buildTaskList>;

  beforeEach(() => {
    ownedList = buildTaskList({ userId: ownerId });
    const taskListRepository = new FakeTaskListRepository([ownedList]);
    const taskRepository = new FakeTaskRepository(taskListRepository);
    app = buildTestApp({ taskRepository, taskListRepository });
  });

  const validTaskPayload = () => ({
    title: 'Preparar apresentação',
    description: 'Slides para a reunião de segunda-feira',
    status: 'PENDING',
    dueDate: '2026-08-10T00:00:00.000Z',
    listId: ownedList.id,
  });

  describe('POST /api/v1/tasks', () => {
    it('retorna 401 sem token de autenticação', async () => {
      const response = await request(app).post('/api/v1/tasks').send(validTaskPayload());
      expect(response.status).toBe(401);
    });

    it('cria uma tarefa e retorna 201', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Preparar apresentação');
      expect(response.body.listId).toBe(ownedList.id);
    });

    it('retorna 404 ao criar tarefa em uma lista de outro usuário', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(validTaskPayload());

      expect(response.status).toBe(404);
    });

    it('retorna 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ title: '', description: '', listId: 'não-é-uuid' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/tasks', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());
    });

    it('lista as tarefas do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('não retorna tarefas de outro usuário (controle de acesso)', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('filtra por status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .query({ status: 'COMPLETED' })
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PATCH /api/v1/tasks/:id', () => {
    it('atualiza uma tarefa do próprio usuário', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      const response = await request(app)
        .patch(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
    });

    it('retorna 400 ao atualizar sem informar nenhum campo', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      const response = await request(app)
        .patch(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('retorna 404 ao tentar atualizar tarefa de outro usuário', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      const response = await request(app)
        .patch(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('remove uma tarefa do próprio usuário', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      const response = await request(app)
        .delete(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(204);
    });

    it('retorna 404 ao tentar remover tarefa de outro usuário', async () => {
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validTaskPayload());

      const response = await request(app)
        .delete(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(404);
    });
  });
});
