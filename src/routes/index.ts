import { Router } from 'express';
import { createAuthRoutes } from '../modules/auth/routes/auth.routes';

export function createRoutes(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.use('/auth', createAuthRoutes());

  return router;
}
