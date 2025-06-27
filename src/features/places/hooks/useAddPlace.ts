import { useLocation, useNavigate } from "react-router-dom";
import { LocationState, PlaceFormData, placeSchema } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddPlaceMutation } from "./useAddPlaceMutation";
import { ROUTES } from "../../../router/ROUTES";

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
  
  if (!coords || !address || !userUid) {
    navigate(ROUTES.HOME, { replace: true });
    throw new Error("Недостаточно данных для сохранения");
  }
  
  const mutation = useAddPlaceMutation({
    coords: coords,
    address: address,
    userUid: userUid
  });

	const onSubmit = form.handleSubmit((data) => {
    mutation.mutateAsync(data).then(() => {
      form.reset()
      navigate(ROUTES.HOME)
    });
	});

	return {
		form,
		onSubmit,
	};
};
