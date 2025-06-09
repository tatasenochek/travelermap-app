import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
	placeSchema,
	type LocationState,
	type PlaceFormData,
} from "../utils/types";
import { supabase } from "../db/config";
import { ROUTES } from "../router/ROUTES";
import { queryClient } from "../store/api/queryClient";

export const useAddPlace = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const { coords, address } = (state as LocationState) || {};
	const { userUid } = useSelector((state: RootState) => state.auth);

	const form = useForm<PlaceFormData>({
		resolver: zodResolver(placeSchema),
		reValidateMode: "onChange",
		mode: "onTouched",
		defaultValues: {
			place_name: "",
			description: "",
			address: address.location || "",
			trip_start_date: "",
			trip_end_date: "",
			photos: [],
		},
	});

	const placeMutation = useMutation({
		mutationFn: async (formData: PlaceFormData) => {
			if (!coords || !address || !userUid) {
				throw new Error("Недостаточно данных для сохранения");
			}
			let placeId: string | null = null;
			try {
				const { data: placeData, error: placeError } = await supabase
					.from("places")
					.insert({
						place_name: formData.place_name,
						description: formData.description || null,
						latitude: coords[0],
						longitude: coords[1],
						location: address.location,
						route: address.route,
						created_at: new Date().toISOString(),
						user_id: userUid,
						trip_start_date: formData.trip_start_date || null,
						trip_end_date: formData.trip_end_date || null,
					})
					.select()
					.single();

				if (placeError || !placeData)
					throw new Error("Не удалось создать место");

				placeId = placeData.id;

				if (formData.photos && formData.photos.length > 0) {
					await Promise.all(
						formData.photos.map(async (file) => {
							const fileExt = file.name.split(".").pop();
							const filePath = `places/${userUid}/${crypto.randomUUID()}.${fileExt}`;
							const { error: uploadError } = await supabase.storage
								.from("photos")
								.upload(filePath, file);

							if (uploadError) throw new Error("Ошибка загрузки фото");
							if (!placeId) throw new Error("Нет ID");

							const { error: photoError } = await supabase
								.from("photos")
								.insert([
									{
										file_name: file.name || null,
										image_path: filePath || null,
										place_id: placeId,
										user_id: userUid,
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

					return { success: true, placeId };
				}
			} catch (error) {
				if (placeId) {
					const { data: photos } = await supabase
						.from("photos")
						.select("image_path")
						.eq("place_id", placeId);

					if (photos && photos.length > 0) {
						const filesToRemove = photos
							.map((photo) => photo.image_path)
							.filter(Boolean);
						await supabase.storage
							.from("photos")
							.remove(filesToRemove as string[]);
					}
					await supabase.from("photos").delete().eq("place_id", placeId);

					await supabase.from("places").delete().eq("id", placeId);
				}
				console.log(error);
			}
		},
		onSuccess: () => {
			toast.success("Место успешно добавлено!");
			queryClient.invalidateQueries({ queryKey: ["places"] });
			queryClient.invalidateQueries({ queryKey: ["photos"] });
			form.reset();
			navigate(ROUTES.HOME);
		},
		onError: (error: Error) => {
			let message = "Не удалось добавить место";
			if (error.message.includes("storage")) {
				message = "Ошибка загрузки фотографий";
			} else if (error.message.includes("place")) {
				message = "Ошибка сохранения данных о месте";
			}
			toast.error(`${message}. Попробуйте еще раз.`);
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		return placeMutation.mutateAsync(data);
	});

	if (!coords || !address) {
		navigate(ROUTES.HOME, { replace: true });
		return null;
	}

	return {
		form,
		register: form.register,
		isSubmitting: placeMutation.isPending,
		isValid: form.formState.isValid,
		errors: form.formState.errors,
		onSubmit,
	};
};
