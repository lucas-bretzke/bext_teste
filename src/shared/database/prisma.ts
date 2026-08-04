import { PrismaClient } from '../../generated/prisma';
import { env } from '../../config/env';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
