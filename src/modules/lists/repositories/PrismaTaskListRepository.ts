import { prisma } from '../../../shared/database/prisma';
import type { TaskList } from '../../../generated/prisma';
import type { CreateTaskListInput, ITaskListRepository } from './ITaskListRepository';

export class PrismaTaskListRepository implements ITaskListRepository {
  create(data: CreateTaskListInput): Promise<TaskList> {
    return prisma.taskList.create({ data });
  }

  findById(id: string): Promise<TaskList | null> {
    return prisma.taskList.findUnique({ where: { id } });
  }

  findByUserIdAndName(userId: string, name: string): Promise<TaskList | null> {
    return prisma.taskList.findUnique({ where: { userId_name: { userId, name } } });
  }

  findManyByUser(userId: string): Promise<TaskList[]> {
    return prisma.taskList.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }
}
