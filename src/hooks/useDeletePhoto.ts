/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../db/config";
import toast from "react-hot-toast";
import { queryClient } from "../store/api/queryClient";

export const useDeletePhoto = () => {
	const deletePhotoMutation = useMutation({
		mutationFn: async (photoId: string) => {
			const { data: photo, error: photoError } = await supabase
				.from("photos")
				.select("*")
				.eq("id", photoId)
        .single();
      
			if (photoError || !photo?.image_path) {
				console.error(photoError);
				throw new Error("Фото не найдено");
			}

			const { error: storageError } = await supabase.storage
				.from("photos")
				.remove([photo.image_path]);

			if (storageError) {
				console.error(storageError);
				throw new Error("Ошибка удаления файла из хранилища");
			}

			const { error: placeError } = await supabase
				.from("photos")
				.delete()
				.eq("id", photoId);

			if (placeError) {
				console.error(placeError);
				throw new Error("Не удалось удалить фото");
			}
		},
		onSuccess: () => {
			toast.success("Фото удалено");

			queryClient.invalidateQueries({ queryKey: ["place"] });
		},
		onError: (error: Error) => {
			toast.error(`Ошибка удаления`);
			console.error(`Ошибка удаления:`, error.message);
		},
	});
	return {
		deletePhoto: deletePhotoMutation.mutate,
		isDeleting: deletePhotoMutation.isPending,
	};
};
