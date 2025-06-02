import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";
import { useParams } from "react-router-dom";
import type { IPlace } from "./useGetAllPlaces";

export const useGetPlaceById = () => {
  const { id } = useParams<{ id: string }>();
  
	const getPlaceByIdQuery = useQuery({
		queryKey: ["place", id],
		queryFn: async () => {
			if (!id) return;

			const { data: place, error } = await supabase
				.from("places")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;

			return {
					...place,
				coords: [place.latitude, place.longitude] as [number, number],
				address: {
					location: place.location,
					route: place.route,
				},
			} as IPlace;
    },
		enabled: !!id,
	});

	return {
		place: getPlaceByIdQuery.data,
		isLoading: getPlaceByIdQuery.isLoading,
		error: getPlaceByIdQuery.error,
	};
};
