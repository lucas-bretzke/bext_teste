import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../../src/shared/utils/jwt';

describe('jwt utils', () => {
  it('gera um token que, ao ser verificado, retorna o mesmo id de usuário', () => {
    const userId = randomUUID();

    const token = signAccessToken(userId);
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe(userId);
  });

  it('lança erro ao verificar um token inválido', () => {
    expect(() => verifyAccessToken('token.invalido.aqui')).toThrow();
  });
});
