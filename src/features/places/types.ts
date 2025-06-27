import { z } from "zod";

export type LocationState = {
	coords: [number, number];
	address: { location: string; route: string };
};

export const placeSchema = z.object({
	place_name: z.string().min(2, "Название должно содержать минимум 2 символа"),
	description: z.string().optional(),
	address: z.string().min(2, "Название должно содержать минимум 2 символа"),
	trip_start_date: z.string().optional(),
	trip_end_date: z.string().optional(),
	photos: z
		.array(z.instanceof(File))
		.max(5, "Можно загрузить не более 5 фотографий")
		.optional(),
});

export type PlaceFormData = z.infer<typeof placeSchema> & {
	photos?: File[];
};
