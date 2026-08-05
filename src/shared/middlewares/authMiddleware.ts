import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { verifyAccessToken } from '../utils/jwt';

const BEARER_PREFIX = 'Bearer ';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError('Token de autenticação ausente.');
  }

  const token = header.slice(BEARER_PREFIX.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    throw new UnauthorizedError('Token de autenticação inválido ou expirado.');
  }
}

export function getAuthenticatedUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError('Token de autenticação ausente.');
  }

  return req.user.id;
}
