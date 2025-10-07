import { z } from "zod";

export const RegisterSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z
		.string()
		.refine(
			(val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
			"Invalid email"
		),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
	email: z
		.string()
		.refine(
			(val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
			"Invalid email"
		),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
