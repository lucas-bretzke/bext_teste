import { randomUUID } from 'node:crypto';
import type { Task } from '../../src/generated/prisma';
import type {
  CreateTaskInput,
  ITaskRepository,
  TaskRepositoryFilters,
  TaskWithListOwner,
  UpdateTaskInput,
} from '../../src/modules/tasks/repositories/ITaskRepository';
import type { ITaskListRepository } from '../../src/modules/lists/repositories/ITaskListRepository';

export class FakeTaskRepository implements ITaskRepository {
  private readonly tasks: TaskWithListOwner[] = [];

  constructor(private readonly taskListRepository: ITaskListRepository) {}

  async create(data: CreateTaskInput): Promise<Task> {
    const list = await this.taskListRepository.findById(data.listId);
    const now = new Date();

    const task: TaskWithListOwner = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate,
      listId: data.listId,
      createdAt: now,
      updatedAt: now,
      list: { userId: list?.userId ?? randomUUID() },
    };

    this.tasks.push(task);
    return task;
  }

  async findManyByUser(userId: string, filters: TaskRepositoryFilters): Promise<Task[]> {
    return this.tasks.filter((task) => {
      if (task.list.userId !== userId) return false;
      if (filters.listId && task.listId !== filters.listId) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo && task.dueDate >= filters.dueDateTo) return false;
      return true;
    });
  }

  async findByIdWithListOwner(id: string): Promise<TaskWithListOwner | null> {
    return this.tasks.find((task) => task.id === id) ?? null;
  }

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    const index = this.tasks.findIndex((task) => task.id === id);
    const current = this.tasks[index];

    if (index === -1 || !current) {
      throw new Error('Tarefa não encontrada no repositório fake.');
    }

    const updated: TaskWithListOwner = { ...current, ...data, updatedAt: new Date() };
    this.tasks[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }
}
