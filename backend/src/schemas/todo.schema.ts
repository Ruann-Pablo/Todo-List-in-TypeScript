import { z } from "zod";

export const CreateTodoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	projectId: z.number().int().optional(),
});

export const UpdateTodoSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	done: z.boolean().optional(),
});
