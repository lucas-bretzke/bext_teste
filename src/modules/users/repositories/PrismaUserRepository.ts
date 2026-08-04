import { prisma } from '../../../shared/database/prisma';
import type { User } from '../../../generated/prisma';
import type { CreateUserInput, IUserRepository } from './IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
