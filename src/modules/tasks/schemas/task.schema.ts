import { z } from 'zod';

export const taskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

const taskFieldsSchema = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório.').max(200),
  description: z.string().trim().min(1, 'A descrição é obrigatória.'),
  status: taskStatusSchema,
  dueDate: z.coerce.date({ error: 'Data de vencimento inválida.' }),
  listId: z.uuid('Lista inválida.'),
});

export const createTaskSchema = taskFieldsSchema.extend({
  status: taskStatusSchema.default('PENDING'),
});

export const updateTaskSchema = taskFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Informe ao menos um campo para atualizar.');

export const taskFiltersSchema = z.object({
  listId: z.uuid('Lista inválida.').optional(),
  status: taskStatusSchema.optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.')
    .optional(),
});

export const taskIdParamsSchema = z.object({
  id: z.uuid('Identificador de tarefa inválido.'),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskFiltersSchema = z.infer<typeof taskFiltersSchema>;
export type TaskIdParamsSchema = z.infer<typeof taskIdParamsSchema>;
