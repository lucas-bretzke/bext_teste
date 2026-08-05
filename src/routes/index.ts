import { Router } from 'express';
import { createAuthRoutes } from '../modules/auth/routes/auth.routes';
import { createListRoutes } from '../modules/lists/routes/list.routes';
import { createTaskRoutes } from '../modules/tasks/routes/task.routes';

export function createRoutes(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.use('/auth', createAuthRoutes());
  router.use('/lists', createListRoutes());
  router.use('/tasks', createTaskRoutes());

  return router;
}
