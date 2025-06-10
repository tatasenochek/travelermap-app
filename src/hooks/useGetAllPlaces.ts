import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";

export interface IPlaceMarker {
	id: string;
	user_id: string;
	coords: [number, number];
	dateStart: string;
	dateEnd: string;
	title: string;
}

export const useGetAllPlaces = () => {
	const getAllPlacesQuery = useQuery({
		queryKey: ["places"],
		queryFn: async () => {
			const { data, error } = await supabase.from("places").select("*");

			if (error) throw new Error(error.message);

			return data.map((place) => ({
				...place,
				id: place.id,
				user_id: place.user_id,
				title: place.place_name,
				dateStart: place.trip_start_date,
				dateEnd: place.trip_end_date,
				coords: [place.latitude, place.longitude] as [number, number],
			})) as IPlaceMarker[];
		},
	});

	return {
		places: getAllPlacesQuery.data,
		isLoading: getAllPlacesQuery.isLoading,
	};
};
