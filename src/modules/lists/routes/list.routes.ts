import { Router } from 'express';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { validate } from '../../../shared/middlewares/validate';
import { TaskListController } from '../controllers/TaskListController';
import { PrismaTaskListRepository } from '../repositories/PrismaTaskListRepository';
import type { ITaskListRepository } from '../repositories/ITaskListRepository';
import { TaskListService } from '../services/TaskListService';
import { createTaskListSchema } from '../schemas/task-list.schema';

export function createListRoutes(
  taskListRepository: ITaskListRepository = new PrismaTaskListRepository(),
): Router {
  const taskListService = new TaskListService(taskListRepository);
  const taskListController = new TaskListController(taskListService);

  const router = Router();

  router.use(authMiddleware);

  router.post('/', validate(createTaskListSchema), taskListController.create);
  router.get('/', taskListController.list);

  return router;
}
