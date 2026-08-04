import { Router } from 'express';
import { validate } from '../../../shared/middlewares/validate';
import { PrismaUserRepository } from '../../users/repositories/PrismaUserRepository';
import type { IUserRepository } from '../../users/repositories/IUserRepository';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export function createAuthRoutes(
  userRepository: IUserRepository = new PrismaUserRepository(),
): Router {
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  const router = Router();

  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);

  return router;
}
