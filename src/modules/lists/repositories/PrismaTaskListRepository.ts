import { prisma } from '../../../shared/database/prisma';
import type { TaskList } from '../../../generated/prisma';
import type { ITaskListRepository } from './ITaskListRepository';

export class PrismaTaskListRepository implements ITaskListRepository {
  findById(id: string): Promise<TaskList | null> {
    return prisma.taskList.findUnique({ where: { id } });
  }
}
