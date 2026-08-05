import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { TaskListService } from '../../src/modules/lists/services/TaskListService';
import { ConflictError } from '../../src/shared/errors';
import { FakeTaskListRepository } from '../helpers/FakeTaskListRepository';

describe('TaskListService', () => {
  const userId = randomUUID();
  const otherUserId = randomUUID();
  let taskListRepository: FakeTaskListRepository;
  let taskListService: TaskListService;

  beforeEach(() => {
    taskListRepository = new FakeTaskListRepository();
    taskListService = new TaskListService(taskListRepository);
  });

  describe('create', () => {
    it('cria uma lista para o usuário autenticado', async () => {
      const list = await taskListService.create(userId, { name: 'Trabalho' });

      expect(list.name).toBe('Trabalho');
      expect(list.userId).toBe(userId);
    });

    it('rejeita nome duplicado para o mesmo usuário', async () => {
      await taskListService.create(userId, { name: 'Trabalho' });

      await expect(taskListService.create(userId, { name: 'Trabalho' })).rejects.toThrow(
        ConflictError,
      );
    });

    it('permite o mesmo nome para usuários diferentes', async () => {
      await taskListService.create(userId, { name: 'Trabalho' });

      const list = await taskListService.create(otherUserId, { name: 'Trabalho' });

      expect(list.userId).toBe(otherUserId);
    });
  });

  describe('listForUser', () => {
    it('lista apenas as listas do usuário autenticado', async () => {
      await taskListService.create(userId, { name: 'Trabalho' });
      await taskListService.create(userId, { name: 'Pessoal' });
      await taskListService.create(otherUserId, { name: 'Trabalho' });

      const lists = await taskListService.listForUser(userId);

      expect(lists).toHaveLength(2);
    });
  });
});
