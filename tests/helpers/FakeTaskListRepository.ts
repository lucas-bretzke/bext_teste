import type { TaskList } from '../../src/generated/prisma';
import type { ITaskListRepository } from '../../src/modules/lists/repositories/ITaskListRepository';

export class FakeTaskListRepository implements ITaskListRepository {
  constructor(private readonly lists: TaskList[] = []) {}

  async findById(id: string): Promise<TaskList | null> {
    return this.lists.find((list) => list.id === id) ?? null;
  }
}
