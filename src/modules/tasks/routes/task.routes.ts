import { Router } from 'express';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { validate } from '../../../shared/middlewares/validate';
import { PrismaTaskListRepository } from '../../lists/repositories/PrismaTaskListRepository';
import type { ITaskListRepository } from '../../lists/repositories/ITaskListRepository';
import { TaskController } from '../controllers/TaskController';
import { PrismaTaskRepository } from '../repositories/PrismaTaskRepository';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import { TaskService } from '../services/TaskService';
import {
  createTaskSchema,
  taskFiltersSchema,
  taskIdParamsSchema,
  updateTaskSchema,
} from '../schemas/task.schema';

export function createTaskRoutes(
  taskRepository: ITaskRepository = new PrismaTaskRepository(),
  taskListRepository: ITaskListRepository = new PrismaTaskListRepository(),
): Router {
  const taskService = new TaskService(taskRepository, taskListRepository);
  const taskController = new TaskController(taskService);

  const router = Router();

  router.use(authMiddleware);

  router.post('/', validate(createTaskSchema), taskController.create);
  router.get('/', validate(taskFiltersSchema, 'query'), taskController.list);
  router.patch(
    '/:id',
    validate(taskIdParamsSchema, 'params'),
    validate(updateTaskSchema),
    taskController.update,
  );
  router.delete('/:id', validate(taskIdParamsSchema, 'params'), taskController.remove);

  return router;
}
