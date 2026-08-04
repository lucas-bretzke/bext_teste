import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória.'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET deve ter ao menos 16 caracteres.'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Variáveis de ambiente inválidas:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Configuração de ambiente inválida.');
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === 'production';
