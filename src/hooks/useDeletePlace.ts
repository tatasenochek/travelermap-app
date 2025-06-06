import { useMutation } from "@tanstack/react-query";
import { supabase } from "../db/config";
import toast from "react-hot-toast";
import { queryClient } from "../store/api/queryClient";

export const useDeletePlace = () => {
	const deleteMutation = useMutation({
		mutationFn: async (placeId: string) => {
			const { data: photos, error: photosError } = await supabase
				.from("photos")
				.select("*")
				.eq("place_id", placeId);

			if (photosError) throw new Error("Не удалось получить фото для удаления");

			const imagesPath = photos
				.map((photo) => photo.image_path)
				.filter(Boolean);

			if (imagesPath.length > 0) {
				const { error: storageError } = await supabase.storage
					.from("photos")
					.remove(imagesPath as string[]);

				if (storageError)
					throw new Error("Ошибка удаления файлов из хранилища");
			}

			const { error: placeError } = await supabase
				.from("places")
				.delete()
				.eq("id", placeId);

			if (placeError) throw new Error("Не удалось удалить место");
		},
		onSuccess: () => {
			toast.success("Место и фото удалены");
			queryClient.invalidateQueries({ queryKey: ["places"] });
		},
		onError: (error: Error) => {
			toast.error(`Ошибка удаления`);
			console.error(`Ошибка удаления:`, error.message);
		},
	});

  return {
		deletePlace: deleteMutation.mutate,
		isDeleting: deleteMutation.isPending,
	};
};
