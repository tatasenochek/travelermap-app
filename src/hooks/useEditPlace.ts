import { useForm } from "react-hook-form";
import { useGetPlaceById } from "./useGetPlaceById";
import { placeSchema, type PlaceFormData } from "../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../db/config";
import toast from "react-hot-toast";
import { queryClient } from "../store/api/queryClient";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/ROUTES";

export const useEditPlace = () => {
	const { place } = useGetPlaceById();
	const navigate = useNavigate();

	const form = useForm<PlaceFormData>({
		resolver: zodResolver(placeSchema),
		reValidateMode: "onChange",
		mode: "onTouched",
		defaultValues: {
			place_name: place?.place_name || "",
			description: place?.description || "",
			address: place?.location || "",
			trip_start_date: place?.trip_start_date || "",
			trip_end_date: place?.trip_end_date || "",
			photos: [],
		},
	});

	const placeMutation = useMutation({
		mutationFn: async (formData: PlaceFormData) => {
			if (!place) throw new Error("Нет данных о месте");
			const { error: placeError } = await supabase
				.from("places")
				.update({
					place_name: formData.place_name,
					description: formData.description || null,
					location: place.address.location,
					trip_start_date: formData.trip_start_date || null,
					trip_end_date: formData.trip_end_date || null,
				})
				.eq("id", place.id);

			if (placeError) {
				console.error("Не удалось отредактировать место", placeError);
				throw new Error("Не удалось отредактировать место");
			}

			const newPhotos = formData.photos ?? [];
			const currentPhotoCount = place.photos.length;

			if (newPhotos.length + currentPhotoCount > 5) {
				toast.error("Превышен лимит фотографий");
				throw new Error("Лимит фотографий превышен");
			}

			await Promise.all(
				newPhotos.map(async (file) => {
					const fileExt = file.name.split(".").pop();
					const filePath = `places/${
						place.user_id
					}/${crypto.randomUUID()}.${fileExt}`;
					const { error: uploadError } = await supabase.storage
						.from("photos")
						.upload(filePath, file);

					if (uploadError) throw new Error("Ошибка загрузки фото");

					const { error: photoError } = await supabase.from("photos").insert([
						{
							file_name: file.name || null,
							image_path: filePath || null,
							place_id: place.id,
							user_id: place.user_id,
							created_at: new Date().toISOString(),
						},
					]);

					if (photoError) {
						console.error(
							"Ошибка вставки в таблицу photos:",
							photoError.message
						);
						throw photoError;
					}
				})
			);

			return { success: true };
		},
		onSuccess: () => {
			toast.success("Место успешно отредактировано!");
			queryClient.invalidateQueries({ queryKey: ["places"] });
			queryClient.invalidateQueries({ queryKey: ["photos"] });
			form.reset();
			navigate(`${ROUTES.PLACE}/${place?.id}`);
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

		if (!place) return null;

	const onSubmit = form.handleSubmit((data) => {
		return placeMutation.mutateAsync(data);
	});

	return {
		form,
		onSubmit,
	};
};
