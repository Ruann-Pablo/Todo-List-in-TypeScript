import * as z from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  done: z.boolean().optional(),
});
