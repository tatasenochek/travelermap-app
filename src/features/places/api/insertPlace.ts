import { SupabaseClient } from "@supabase/supabase-js";
import { LocationState, PlaceFormData } from "../types";

export async function insertPlace(
	client: SupabaseClient,
	userUid: string,
	formData: PlaceFormData,
	coords: [number, number],
	address: LocationState["address"]
) {
	const { data: place, error } = await client
		.from("places")
		.insert({
			place_name: formData.place_name,
			description: formData.description || null,
			latitude: coords[0],
			longitude: coords[1],
			location: address.location,
			route: address.route,
			user_id: userUid,
			trip_start_date: formData.trip_start_date || null,
			trip_end_date: formData.trip_end_date || null,
			created_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error || !place) throw new Error("Ошибка при добавлении места");

	return place;
}
