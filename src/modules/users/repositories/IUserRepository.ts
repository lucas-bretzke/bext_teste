import type { User } from '../../../generated/prisma';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  create(data: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
