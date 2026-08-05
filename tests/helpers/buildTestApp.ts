import express, { type Express } from 'express';
import { createAuthRoutes } from '../../src/modules/auth/routes/auth.routes';
import { createTaskRoutes } from '../../src/modules/tasks/routes/task.routes';
import { errorHandler } from '../../src/shared/middlewares/errorHandler';
import type { IUserRepository } from '../../src/modules/users/repositories/IUserRepository';
import type { ITaskRepository } from '../../src/modules/tasks/repositories/ITaskRepository';
import type { ITaskListRepository } from '../../src/modules/lists/repositories/ITaskListRepository';

interface TestAppDependencies {
  userRepository?: IUserRepository;
  taskRepository?: ITaskRepository;
  taskListRepository?: ITaskListRepository;
}

export function buildTestApp(dependencies: TestAppDependencies = {}): Express {
  const app = express();

  app.use(express.json());
  app.use('/api/v1/auth', createAuthRoutes(dependencies.userRepository));
  app.use(
    '/api/v1/tasks',
    createTaskRoutes(dependencies.taskRepository, dependencies.taskListRepository),
  );
  app.use(errorHandler);

  return app;
}
