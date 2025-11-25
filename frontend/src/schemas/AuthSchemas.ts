import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome muito curto' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(3, "Nome muito curto").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional(),
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type UpdateUserForm = z.infer<typeof UpdateUserSchema>;