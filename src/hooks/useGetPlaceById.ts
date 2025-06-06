import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";
import { useParams } from "react-router-dom";
import type { PhotosRow, PlaceRow } from "../db/types";

export interface IPlace extends Omit<PlaceRow, "latitude" | "longitude"> {
	id: string;
	coords: [number, number];
	address: {
		location: string;
		route: string;
	};
	photos: PhotosRow[];
}

export const useGetPlaceById = () => {
  const { id } = useParams<{ id: string }>();
  
	const getPlaceByIdQuery = useQuery({
		queryKey: ["place", id],
		queryFn: async () => {
			if (!id) return;

			const { data: place, error } = await supabase
				.from("places")
				.select("*, photos(*)")
				.eq("id", id)
				.single();

			if (error) throw new Error(error.message);

			return {
					...place,
				coords: [place.latitude, place.longitude] as [number, number],
				address: {
					location: place.location,
					route: place.route,
				},
				photos: place.photos || [],
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
