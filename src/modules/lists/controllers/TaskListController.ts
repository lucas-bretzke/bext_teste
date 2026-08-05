import type { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../../../shared/middlewares/authMiddleware';
import type { TaskListService } from '../services/TaskListService';

export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const list = await this.taskListService.create(getAuthenticatedUserId(req), req.body);
    res.status(201).json(list);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const lists = await this.taskListService.listForUser(getAuthenticatedUserId(req));
    res.status(200).json(lists);
  };
}
