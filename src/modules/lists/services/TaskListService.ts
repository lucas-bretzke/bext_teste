import { ConflictError } from '../../../shared/errors';
import type { ITaskListRepository } from '../repositories/ITaskListRepository';
import type { CreateTaskListSchema } from '../schemas/task-list.schema';
import type { TaskList } from '../../../generated/prisma';

export class TaskListService {
  constructor(private readonly taskListRepository: ITaskListRepository) {}

  async create(userId: string, input: CreateTaskListSchema): Promise<TaskList> {
    const existing = await this.taskListRepository.findByUserIdAndName(userId, input.name);

    if (existing) {
      throw new ConflictError('Você já possui uma lista com este nome.');
    }

    return this.taskListRepository.create({ name: input.name, userId });
  }

  listForUser(userId: string): Promise<TaskList[]> {
    return this.taskListRepository.findManyByUser(userId);
  }
}
