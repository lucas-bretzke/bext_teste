import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface TokenPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<jwt.SignOptions['expiresIn']>,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    throw new Error('Token com formato inválido.');
  }

  return { sub: decoded.sub };
}
