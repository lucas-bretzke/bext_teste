import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Dados inválidos.',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  logger.error({ err }, 'Erro não tratado');
  res.status(500).json({ message: 'Erro interno do servidor.' });
}
