import * as z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "O nome do projeto deve ter ao menos 3 caracteres"),
});

export const searchProjectSchema = z.object({
  query: z.string().optional(),
});
