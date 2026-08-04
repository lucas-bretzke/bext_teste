import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../../src/shared/middlewares/authMiddleware';
import { UnauthorizedError } from '../../src/shared/errors';
import { signAccessToken } from '../../src/shared/utils/jwt';

function buildRequest(authorization?: string): Request {
  return { headers: { authorization } } as Request;
}

describe('authMiddleware', () => {
  it('anexa o usuário autenticado à requisição quando o token é válido', () => {
    const userId = randomUUID();
    const token = signAccessToken(userId);
    const req = buildRequest(`Bearer ${token}`);
    const next = vi.fn() as NextFunction;

    authMiddleware(req, {} as Response, next);

    expect(req.user).toEqual({ id: userId });
    expect(next).toHaveBeenCalledOnce();
  });

  it('lança UnauthorizedError quando o cabeçalho de autorização está ausente', () => {
    const req = buildRequest(undefined);
    const next = vi.fn() as NextFunction;

    expect(() => authMiddleware(req, {} as Response, next)).toThrow(UnauthorizedError);
  });

  it('lança UnauthorizedError quando o token é inválido', () => {
    const req = buildRequest('Bearer token-forjado');
    const next = vi.fn() as NextFunction;

    expect(() => authMiddleware(req, {} as Response, next)).toThrow(UnauthorizedError);
  });
});
