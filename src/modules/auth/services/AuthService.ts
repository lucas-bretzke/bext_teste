import { ConflictError, UnauthorizedError } from '../../../shared/errors';
import { signAccessToken } from '../../../shared/utils/jwt';
import { comparePassword, hashPassword } from '../../../shared/utils/password';
import type { IUserRepository } from '../../users/repositories/IUserRepository';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';

export interface AuthResult {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register({ email, password }: RegisterInput): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Já existe um usuário cadastrado com este e-mail.');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepository.create({ email, passwordHash });

    return this.buildAuthResult(user.id, user.email);
  }

  async login({ email, password }: LoginInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);
    const isPasswordValid = user ? await comparePassword(password, user.passwordHash) : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    return this.buildAuthResult(user.id, user.email);
  }

  private buildAuthResult(userId: string, email: string): AuthResult {
    return {
      user: { id: userId, email },
      token: signAccessToken(userId),
    };
  }
}
