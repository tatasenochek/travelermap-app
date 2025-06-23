export const handleDeletePhoto = (
	isVisible: string | null,
	deletePhoto: (id: string) => void
) => {
	if (typeof isVisible === "string") {
		deletePhoto(isVisible);
	}
};
