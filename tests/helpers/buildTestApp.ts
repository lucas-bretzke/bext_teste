import express, { type Express } from 'express';
import { createAuthRoutes } from '../../src/modules/auth/routes/auth.routes';
import { errorHandler } from '../../src/shared/middlewares/errorHandler';
import type { IUserRepository } from '../../src/modules/users/repositories/IUserRepository';

export function buildTestApp(userRepository: IUserRepository): Express {
  const app = express();

  app.use(express.json());
  app.use('/api/v1/auth', createAuthRoutes(userRepository));
  app.use(errorHandler);

  return app;
}
