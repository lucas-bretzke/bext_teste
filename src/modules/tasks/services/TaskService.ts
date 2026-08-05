import { NotFoundError } from '../../../shared/errors';
import type { ITaskListRepository } from '../../lists/repositories/ITaskListRepository';
import type {
  ITaskRepository,
  TaskWithListOwner,
  UpdateTaskInput,
} from '../repositories/ITaskRepository';
import type { CreateTaskSchema, TaskFiltersSchema, UpdateTaskSchema } from '../schemas/task.schema';
import type { Task } from '../../../generated/prisma';

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly taskListRepository: ITaskListRepository,
  ) {}

  async create(userId: string, input: CreateTaskSchema): Promise<Task> {
    await this.ensureListBelongsToUser(input.listId, userId);
    return this.taskRepository.create(input);
  }

  async listForUser(userId: string, filters: TaskFiltersSchema): Promise<Task[]> {
    if (filters.listId) {
      await this.ensureListBelongsToUser(filters.listId, userId);
    }

    return this.taskRepository.findManyByUser(userId, {
      ...(filters.listId ? { listId: filters.listId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...this.buildDueDateRange(filters.dueDate),
    });
  }

  async update(userId: string, taskId: string, input: UpdateTaskSchema): Promise<Task> {
    const task = await this.getOwnedTaskOrFail(taskId, userId);

    if (input.listId && input.listId !== task.listId) {
      await this.ensureListBelongsToUser(input.listId, userId);
    }

    return this.taskRepository.update(taskId, input as UpdateTaskInput);
  }

  async remove(userId: string, taskId: string): Promise<void> {
    await this.getOwnedTaskOrFail(taskId, userId);
    await this.taskRepository.delete(taskId);
  }

  private async ensureListBelongsToUser(listId: string, userId: string): Promise<void> {
    const list = await this.taskListRepository.findById(listId);

    if (!list || list.userId !== userId) {
      throw new NotFoundError('Lista não encontrada.');
    }
  }

  private async getOwnedTaskOrFail(taskId: string, userId: string): Promise<TaskWithListOwner> {
    const task = await this.taskRepository.findByIdWithListOwner(taskId);

    if (!task || task.list.userId !== userId) {
      throw new NotFoundError('Tarefa não encontrada.');
    }

    return task;
  }

  private buildDueDateRange(dueDate?: string): { dueDateFrom?: Date; dueDateTo?: Date } {
    if (!dueDate) {
      return {};
    }

    const dueDateFrom = new Date(`${dueDate}T00:00:00.000Z`);
    const dueDateTo = new Date(dueDateFrom);
    dueDateTo.setUTCDate(dueDateTo.getUTCDate() + 1);

    return { dueDateFrom, dueDateTo };
  }
}
