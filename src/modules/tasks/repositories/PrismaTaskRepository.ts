import { prisma } from '../../../shared/database/prisma';
import type { Task } from '../../../generated/prisma';
import type {
  CreateTaskInput,
  ITaskRepository,
  TaskRepositoryFilters,
  TaskWithListOwner,
  UpdateTaskInput,
} from './ITaskRepository';

export class PrismaTaskRepository implements ITaskRepository {
  create(data: CreateTaskInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  findManyByUser(userId: string, filters: TaskRepositoryFilters): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        list: { userId },
        ...(filters.listId ? { listId: filters.listId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.dueDateFrom || filters.dueDateTo
          ? {
              dueDate: {
                ...(filters.dueDateFrom ? { gte: filters.dueDateFrom } : {}),
                ...(filters.dueDateTo ? { lt: filters.dueDateTo } : {}),
              },
            }
          : {}),
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  findByIdWithListOwner(id: string): Promise<TaskWithListOwner | null> {
    return prisma.task.findUnique({
      where: { id },
      include: { list: { select: { userId: true } } },
    });
  }

  update(id: string, data: UpdateTaskInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}
