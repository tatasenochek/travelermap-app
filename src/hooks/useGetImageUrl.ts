import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";

export const useGetImageUrl = (imagePath?: string | null) => {
	const getImageUrl = useQuery({
		queryKey: ["image", imagePath],
		queryFn: async () => {
			if (!imagePath) return;
			const { data } = supabase.storage
				.from("photos")
				.getPublicUrl(imagePath);
			return data.publicUrl;
		},
		enabled: !!imagePath,
	});

	return {
		imageUrl: getImageUrl.data,
		isLoadingImg: getImageUrl.isLoading,
		isErrorImg: getImageUrl.isError,
	};
};
