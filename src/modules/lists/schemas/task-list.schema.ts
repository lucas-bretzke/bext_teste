import { z } from 'zod';

export const createTaskListSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório.').max(100),
});

export type CreateTaskListSchema = z.infer<typeof createTaskListSchema>;
