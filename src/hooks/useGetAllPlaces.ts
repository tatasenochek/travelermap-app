import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";

export interface IPlaceMarker {
	id: string;
	coords: [number, number];
}

export const useGetAllPlaces = () => {
	const getAllPlacesQuery = useQuery({
		queryKey: ["places"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("places")
				.select("id, latitude, longitude");

			if (error) throw new Error(error.message);

			return data.map((place) => ({
				...place,
				id: place.id,
				coords: [place.latitude, place.longitude] as [number, number],
			})) as IPlaceMarker[];
		},
	});

	return {
		places: getAllPlacesQuery.data,
		isLoading: getAllPlacesQuery.isLoading,
	};
};
