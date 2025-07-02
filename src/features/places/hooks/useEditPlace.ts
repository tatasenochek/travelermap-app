import { useNavigate } from "react-router-dom";
import { useGetPlaceById } from "./useGetPlaceById";
import { useForm } from "react-hook-form";
import { PlaceFormData, placeSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditPlaceMutation } from "./useEditPlaceMutation";
import { ROUTES } from "../../../router/ROUTES";

export const useEditPlace = () => {
	const { place, error } = useGetPlaceById();
	const navigate = useNavigate();

	if (error || !place) throw new Error("Место не найдено");

	const form = useForm<PlaceFormData>({
		resolver: zodResolver(placeSchema),
		reValidateMode: "onChange",
		mode: "onTouched",
		defaultValues: {
			place_name: place.place_name,
			description: place.description || "",
			address: place.location,
			trip_start_date: place.trip_start_date || "",
			trip_end_date: place.trip_end_date || "",
			photos: [],
		},
	});

	const mutation = useEditPlaceMutation({
		placeId: place.id,
		userId: place.user_id,
		currentPhotosCount: place.photos.length || 0,
  });
  
  const onSubmit = form.handleSubmit((data) => {
    mutation.mutateAsync(data).then(() => {
      form.reset()
      navigate(`${ROUTES.PLACE}/${place.id}`)
     });
	});

	return {
		form,
		onSubmit,
	};
};
