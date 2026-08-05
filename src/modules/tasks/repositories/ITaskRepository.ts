import type { Task, TaskStatus } from '../../../generated/prisma';

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  listId: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskRepositoryFilters {
  listId?: string;
  status?: TaskStatus;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface TaskWithListOwner extends Task {
  list: {
    userId: string;
  };
}

export interface ITaskRepository {
  create(data: CreateTaskInput): Promise<Task>;
  findManyByUser(userId: string, filters: TaskRepositoryFilters): Promise<Task[]>;
  findByIdWithListOwner(id: string): Promise<TaskWithListOwner | null>;
  update(id: string, data: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}
