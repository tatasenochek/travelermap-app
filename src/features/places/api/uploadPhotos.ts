import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadPhotos(
	client: SupabaseClient,
	files: File[],
	placeId: string,
	userUid: string
) {
	await Promise.all(
		files.map(async (file) => {
			const fileExt = file.name.split(".").pop();
			const filePath = `places/${userUid}/${crypto.randomUUID()}.${fileExt}`;

			const { error: uploadError } = await client.storage
				.from("photos")
				.upload(filePath, file);

			if (uploadError) {
				throw new Error("Ошибка загрузки фото");
			}

			const { error: photoError } = await client.from("photos").insert([
				{
					file_name: file.name,
					image_path: filePath,
					place_id: placeId,
					user_id: userUid,
					created_at: new Date().toISOString(),
				},
			]);

			if (photoError) {
				throw new Error("Ошибка добавления фото");
			}
		})
	);
}
