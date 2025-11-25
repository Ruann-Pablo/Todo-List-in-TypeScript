import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.number().nullable().optional(),   // <--- IMPORTANTE!
});

export const UpdateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  done: z.boolean().optional(),
  projectId: z.number().nullable().optional(),   // <--- PERMITE ALTERAR PROJECTID
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
