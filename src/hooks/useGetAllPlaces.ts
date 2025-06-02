import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";
import type { PlaceRow } from "../db/types";

export interface IPlace extends Omit<PlaceRow, "latitude" | "longitude"> {
	id: string;
	coords: [number, number];
	address: {
		location: string;
		route: string;
	};
}

export const useGetAllPlaces = () => {
	const getAllPlacesQuery = useQuery({
		queryKey: ["places"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("places")
				.select("*");

			if (error) throw error;

			return data.map((place) => ({
				...place,
				coords: [place.latitude, place.longitude] as [number, number],
				address: {
					location: place.location,
					route: place.route,
				},
			})) as IPlace[];
		},
	});

	return {
		places: getAllPlacesQuery.data,
		isLoading: getAllPlacesQuery.isLoading,
	};
};
