import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { placeSchema, type LocationState, type PlaceFormData } from "../utils/types";
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
			description: ""
		},
	});

	const placeMutation = useMutation({
		mutationFn: async (formData: PlaceFormData) => {
			if (!coords || !address || !userUid) {
				throw new Error("Недостаточно данных для сохранения");
			}

			let imagePath = "";
			let fileName = "";

			if (formData.image) {
				const file = formData.image.name.split(".").pop();
				const filePath = `places/${userUid}/${Date.now()}.${file}`;

				const { error: uploadError } = await supabase.storage
					.from("photos")
					.upload(filePath, formData.image);
				
				if (uploadError) throw new Error("Ошибка загрузки фото");
				
				imagePath = filePath;
				fileName = formData.image.name;
			}

			const { error } = await supabase.from("places").insert({
				place_name: formData.place_name,
				description: formData.description || null,
				latitude: coords[0],
				longitude: coords[1],
				location: address.location,
				route: address.route,
				created_at: new Date().toISOString(),
				user_id: userUid,
				image_path: imagePath || null,
				file_name: fileName || null,
			});

			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Место успешно добавлено!");
			queryClient.invalidateQueries({ queryKey: ["places"] });
			form.reset();
			navigate(ROUTES.HOME);
		},
		onError: (error: Error) => {
			console.error("Ошибка:", error.message);
			toast.error("Не удалось добавить место. Попробуйте еще раз.");
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log("Все данные формы:", data);
		placeMutation.mutate(data)
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
