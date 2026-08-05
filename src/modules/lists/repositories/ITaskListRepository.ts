import type { TaskList } from '../../../generated/prisma';

export interface CreateTaskListInput {
  name: string;
  userId: string;
}

export interface ITaskListRepository {
  create(data: CreateTaskListInput): Promise<TaskList>;
  findById(id: string): Promise<TaskList | null>;
  findByUserIdAndName(userId: string, name: string): Promise<TaskList | null>;
  findManyByUser(userId: string): Promise<TaskList[]>;
}
