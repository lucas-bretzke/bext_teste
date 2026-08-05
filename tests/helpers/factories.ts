import { randomUUID } from 'node:crypto';
import type { TaskList } from '../../src/generated/prisma';

export function buildTaskList(overrides: Partial<TaskList> = {}): TaskList {
  const now = new Date();

  return {
    id: randomUUID(),
    name: 'Minha lista',
    userId: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
