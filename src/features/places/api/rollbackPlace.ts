import { SupabaseClient } from "@supabase/supabase-js";

export async function rollbackPlace(client: SupabaseClient, placeId: string) {
	const { data: photos } = await client
		.from("photos")
		.select("image_path")
		.eq("place_id", placeId);

	if (photos && photos.length > 0) {
		const filesToRemove = photos
			.map((photo) => photo.image_path)
			.filter(Boolean);
		await client.storage.from("photos").remove(filesToRemove as string[]);
	}
	await client.from("photos").delete().eq("place_id", placeId);

	await client.from("places").delete().eq("id", placeId);
}
