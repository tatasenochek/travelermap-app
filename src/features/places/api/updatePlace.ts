import { SupabaseClient } from "@supabase/supabase-js";
import { PlaceFormData } from "../types";

export async function updatePlace(
	client: SupabaseClient,
	formData: PlaceFormData,
	address: string,
	placeId: string
) {
	const { error: placeError } = await client
		.from("places")
		.update({
			place_name: formData.place_name,
			description: formData.description ?? null,
			location: address,
			trip_start_date: formData.trip_start_date ?? null,
			trip_end_date: formData.trip_end_date ?? null,
		})
		.eq("id", placeId);

	if (placeError) throw new Error("Ошибка при редактировании места");
}
