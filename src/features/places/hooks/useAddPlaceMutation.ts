import { useMutation } from "@tanstack/react-query";
import { LocationState, PlaceFormData } from "../types";
import { insertPlace } from "../api/insertPlace";
import { supabase } from "../../../db/config";
import { uploadPhotos } from "../api/uploadPhotos";
import { rollbackPlace } from "../api/rollbackPlace";
import toast from "react-hot-toast";
import { queryClient } from "../../../store/api/queryClient";

type Params = {
	coords: [number, number];
	address: LocationState["address"];
	userUid: string;
};

export function useAddPlaceMutation({ coords, address, userUid }: Params) {
	return useMutation({
		mutationFn: async (formData: PlaceFormData) => {
			let placeId: string | null = null;
			try {
				const place = await insertPlace(
					supabase,
					userUid,
					formData,
					coords,
					address
				);
				placeId = place.id;

				if (formData.photos && formData.photos.length > 0 && placeId) {
					await uploadPhotos(supabase, formData.photos, placeId, userUid);
				}

				return { success: true, placeId };
			} catch (error) {
				if (placeId) {
					await rollbackPlace(supabase, placeId);
					throw new Error(
						"Ошибка при добавлении места: " + (error as Error).message
					);
				}
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Место успешно добавлено!");
			queryClient.invalidateQueries({ queryKey: ["places"] });
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		},
		onError: (error: Error) => {
			let message = "Не удалось добавить место";
			if (error.message.includes("storage")) {
				message = "Ошибка загрузки фотографий";
			} else if (error.message.includes("place")) {
				message = "Ошибка сохранения данных о месте";
			}
			toast.error(`${message}. Попробуйте еще раз.`);
			throw error;
		},
	});
}
