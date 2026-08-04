import { describe, expect, it } from 'vitest';
import { comparePassword, hashPassword } from '../../src/shared/utils/password';

describe('password utils', () => {
  it('gera um hash diferente da senha original e validável com comparePassword', async () => {
    const hash = await hashPassword('senha1234');

    expect(hash).not.toBe('senha1234');
    await expect(comparePassword('senha1234', hash)).resolves.toBe(true);
  });

  it('rejeita a comparação com uma senha incorreta', async () => {
    const hash = await hashPassword('senha1234');

    await expect(comparePassword('senha-errada', hash)).resolves.toBe(false);
  });
});
