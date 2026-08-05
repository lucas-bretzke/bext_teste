import { randomUUID } from 'node:crypto';
import type { TaskList } from '../../src/generated/prisma';
import type {
  CreateTaskListInput,
  ITaskListRepository,
} from '../../src/modules/lists/repositories/ITaskListRepository';

export class FakeTaskListRepository implements ITaskListRepository {
  constructor(private readonly lists: TaskList[] = []) {}

  async create(data: CreateTaskListInput): Promise<TaskList> {
    const now = new Date();
    const list: TaskList = {
      id: randomUUID(),
      name: data.name,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    };

    this.lists.push(list);
    return list;
  }

  async findById(id: string): Promise<TaskList | null> {
    return this.lists.find((list) => list.id === id) ?? null;
  }

  async findByUserIdAndName(userId: string, name: string): Promise<TaskList | null> {
    return this.lists.find((list) => list.userId === userId && list.name === name) ?? null;
  }

  async findManyByUser(userId: string): Promise<TaskList[]> {
    return this.lists.filter((list) => list.userId === userId);
  }
}
