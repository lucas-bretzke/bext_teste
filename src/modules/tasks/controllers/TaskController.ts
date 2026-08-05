import type { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../../../shared/middlewares/authMiddleware';
import type { TaskService } from '../services/TaskService';
import type { TaskFiltersSchema, TaskIdParamsSchema } from '../schemas/task.schema';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const task = await this.taskService.create(getAuthenticatedUserId(req), req.body);
    res.status(201).json(task);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as TaskFiltersSchema;
    const tasks = await this.taskService.listForUser(getAuthenticatedUserId(req), filters);
    res.status(200).json(tasks);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as TaskIdParamsSchema;
    const task = await this.taskService.update(getAuthenticatedUserId(req), id, req.body);
    res.status(200).json(task);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as TaskIdParamsSchema;
    await this.taskService.remove(getAuthenticatedUserId(req), id);
    res.status(204).send();
  };
}
