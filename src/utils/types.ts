import { z } from "zod";

export const EmailSchema = z
	.string()
	.min(1, "Email обязателен")
	.regex(
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		"Пример: user@example.com"
	);

export const PasswordSchema = z
	.string()
	.min(6, "Пароль должен быть не короче 6 символов");

export const SigninSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
});

export const SignupSchema = z.object({
	name: z.string().min(3, "Имя должно быть не короче 3 символов"),
	email: EmailSchema,
	password: PasswordSchema,
});

export type SignupFormData = z.infer<typeof SignupSchema>;
export type SigninFormData = z.infer<typeof SigninSchema>;
