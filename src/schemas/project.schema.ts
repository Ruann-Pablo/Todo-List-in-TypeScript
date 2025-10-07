import { z } from "zod";

export const CreateProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
});
