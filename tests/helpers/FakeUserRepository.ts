import { randomUUID } from 'node:crypto';
import type { User } from '../../src/generated/prisma';
import type {
  CreateUserInput,
  IUserRepository,
} from '../../src/modules/users/repositories/IUserRepository';

export class FakeUserRepository implements IUserRepository {
  private readonly users: User[] = [];

  async create(data: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
