import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { TaskService } from '../../src/modules/tasks/services/TaskService';
import { NotFoundError } from '../../src/shared/errors';
import { FakeTaskListRepository } from '../helpers/FakeTaskListRepository';
import { FakeTaskRepository } from '../helpers/FakeTaskRepository';
import { buildTaskList } from '../helpers/factories';

describe('TaskService', () => {
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  let ownedList: ReturnType<typeof buildTaskList>;
  let otherUsersList: ReturnType<typeof buildTaskList>;
  let taskListRepository: FakeTaskListRepository;
  let taskRepository: FakeTaskRepository;
  let taskService: TaskService;

  beforeEach(() => {
    ownedList = buildTaskList({ userId: ownerId });
    otherUsersList = buildTaskList({ userId: otherUserId });
    taskListRepository = new FakeTaskListRepository([ownedList, otherUsersList]);
    taskRepository = new FakeTaskRepository(taskListRepository);
    taskService = new TaskService(taskRepository, taskListRepository);
  });

  describe('create', () => {
    it('cria uma tarefa quando a lista pertence ao usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Escrever relatório',
        description: 'Relatório mensal de vendas',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      expect(task.title).toBe('Escrever relatório');
      expect(task.listId).toBe(ownedList.id);
    });

    it('rejeita a criação quando a lista pertence a outro usuário', async () => {
      await expect(
        taskService.create(ownerId, {
          title: 'Tarefa indevida',
          description: 'Não deveria ser criada',
          status: 'PENDING',
          dueDate: new Date('2026-08-10T00:00:00.000Z'),
          listId: otherUsersList.id,
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('rejeita a criação quando a lista não existe', async () => {
      await expect(
        taskService.create(ownerId, {
          title: 'Tarefa órfã',
          description: 'Lista inexistente',
          status: 'PENDING',
          dueDate: new Date('2026-08-10T00:00:00.000Z'),
          listId: randomUUID(),
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('listForUser', () => {
    beforeEach(async () => {
      await taskService.create(ownerId, {
        title: 'Tarefa pendente',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });
      await taskService.create(ownerId, {
        title: 'Tarefa concluída',
        description: 'Descrição',
        status: 'COMPLETED',
        dueDate: new Date('2026-08-15T00:00:00.000Z'),
        listId: ownedList.id,
      });
    });

    it('lista apenas as tarefas do usuário autenticado', async () => {
      const tasks = await taskService.listForUser(ownerId, {});
      expect(tasks).toHaveLength(2);
    });

    it('filtra por status', async () => {
      const tasks = await taskService.listForUser(ownerId, { status: 'COMPLETED' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0]?.title).toBe('Tarefa concluída');
    });

    it('filtra por data de vencimento', async () => {
      const tasks = await taskService.listForUser(ownerId, { dueDate: '2026-08-10' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0]?.title).toBe('Tarefa pendente');
    });

    it('rejeita filtro por lista que não pertence ao usuário', async () => {
      await expect(taskService.listForUser(ownerId, { listId: otherUsersList.id })).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('update', () => {
    it('atualiza uma tarefa do próprio usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Original',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      const updated = await taskService.update(ownerId, task.id, { status: 'IN_PROGRESS' });

      expect(updated.status).toBe('IN_PROGRESS');
    });

    it('rejeita atualização de tarefa de outro usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Original',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      await expect(
        taskService.update(otherUserId, task.id, { status: 'COMPLETED' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('rejeita mover a tarefa para uma lista que não pertence ao usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Original',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      await expect(
        taskService.update(ownerId, task.id, { listId: otherUsersList.id }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('remove uma tarefa do próprio usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Para remover',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      await taskService.remove(ownerId, task.id);

      const tasks = await taskService.listForUser(ownerId, {});
      expect(tasks).toHaveLength(0);
    });

    it('rejeita remoção de tarefa de outro usuário', async () => {
      const task = await taskService.create(ownerId, {
        title: 'Protegida',
        description: 'Descrição',
        status: 'PENDING',
        dueDate: new Date('2026-08-10T00:00:00.000Z'),
        listId: ownedList.id,
      });

      await expect(taskService.remove(otherUserId, task.id)).rejects.toThrow(NotFoundError);
    });
  });
});
