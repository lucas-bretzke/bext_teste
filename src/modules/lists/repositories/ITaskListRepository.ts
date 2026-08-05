import type { TaskList } from '../../../generated/prisma';

export interface ITaskListRepository {
  findById(id: string): Promise<TaskList | null>;
}
