import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../../src/modules/auth/services/AuthService';
import { ConflictError, UnauthorizedError } from '../../src/shared/errors';
import { FakeUserRepository } from '../helpers/FakeUserRepository';

describe('AuthService', () => {
  let userRepository: FakeUserRepository;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('cria um usuário e retorna um token de acesso', async () => {
      const result = await authService.register({
        email: 'ana@example.com',
        password: 'senha1234',
      });

      expect(result.user.email).toBe('ana@example.com');
      expect(result.user.id).toBeTypeOf('string');
      expect(result.token).toBeTypeOf('string');
    });

    it('nunca persiste a senha em texto puro', async () => {
      await authService.register({ email: 'ana@example.com', password: 'senha1234' });

      const storedUser = await userRepository.findByEmail('ana@example.com');
      expect(storedUser?.passwordHash).not.toBe('senha1234');
    });

    it('rejeita cadastro com e-mail já existente', async () => {
      await authService.register({ email: 'ana@example.com', password: 'senha1234' });

      await expect(
        authService.register({ email: 'ana@example.com', password: 'outrasenha' }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('autentica um usuário com credenciais válidas', async () => {
      await authService.register({ email: 'ana@example.com', password: 'senha1234' });

      const result = await authService.login({ email: 'ana@example.com', password: 'senha1234' });

      expect(result.user.email).toBe('ana@example.com');
      expect(result.token).toBeTypeOf('string');
    });

    it('rejeita login com senha incorreta', async () => {
      await authService.register({ email: 'ana@example.com', password: 'senha1234' });

      await expect(
        authService.login({ email: 'ana@example.com', password: 'senhaerrada' }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('rejeita login para e-mail não cadastrado', async () => {
      await expect(
        authService.login({ email: 'inexistente@example.com', password: 'qualquersenha' }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
