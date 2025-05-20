import { z } from "zod";

export const EmailSchema = z
	.string()
	.min(1, "Email обязателен")
	.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Пример: user@example.com");

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

const coordinateSchema = z.number().min(-90).max(90);
const photoSchema = z.instanceof(File, {message: "Загрузите фото"});

export const placeSchema = z.object({
	title: z.string().min(3, "Название должно содержать минимум 3 символа"),
	description: z.string().optional().nullable(),
	country: z.string().min(1, "Укажите страну"),
	city: z.string().min(1, "Укажите город"),
	address: z.string().optional().nullable(),
	lat: coordinateSchema,
	lng: coordinateSchema,
	photos: z.array(photoSchema).optional().nullable(),
	tags: z.array(z.string()).optional().nullable(),
	visit_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Формат даты: YYYY-MM-DD")
		.optional()
		.nullable(),
	user_id: z.string().optional(),
	username: z.string().optional(),
	created_at: z.string().optional().nullable(),
	updated_at: z.string().optional().nullable(),
});

export const placeFormSchema = placeSchema.omit({
	user_id: true,
	username: true,
	created_at: true,
	updated_at: true,
});

export type PlaceFormData = z.infer<typeof placeFormSchema>;
export type PlaceData = z.infer<typeof placeSchema>;
export type SignupFormData = z.infer<typeof SignupSchema>;
export type SigninFormData = z.infer<typeof SigninSchema>;
