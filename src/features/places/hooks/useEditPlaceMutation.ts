import { useMutation } from "@tanstack/react-query";
import { updatePlace } from "../api/updatePlace";
import { supabase } from "../../../db/config";
import { PlaceFormData } from "../types";
import toast from "react-hot-toast";
import { uploadPhotos } from "../api/uploadPhotos";
import { queryClient } from "../../../store/api/queryClient";

type Params = {
	placeId: string;
	userId: string;
	currentPhotosCount: number;
};

export function useEditPlaceMutation({
	placeId,
	userId,
	currentPhotosCount,
}: Params) {
	return useMutation({
		mutationFn: async (formData: PlaceFormData) => {
			await updatePlace(supabase, formData, formData.address, placeId);

			const newPhotos = formData.photos ?? [];
			const totalPhotos = newPhotos.length + currentPhotosCount;

			if (totalPhotos > 5) {
				toast.error("Превышен лимит фотографий");
				throw new Error("Превышен лимит фотографий");
			}

			if (newPhotos.length > 0) {
				await uploadPhotos(supabase, newPhotos, placeId, userId);
			}

			return { success: true };
		},
		onSuccess: () => {
			toast.success("Место успешно отредактировано!");
			queryClient.invalidateQueries({ queryKey: ["places"] });
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		},
		onError: (error: Error) => {
			let message = "Не удалось отредактировать место";
			if (error.message.includes("storage")) {
				message = "Ошибка загрузки фотографий";
			} else if (error.message.includes("place")) {
				message = "Ошибка сохранения данных о месте";
			}
			toast.error(`${message}. Попробуйте еще раз.`);
		},
	});
}
