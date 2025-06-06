export const getFormattedDate = (data: string | null) => {
	if (!data) return;

	return new Date(data).toLocaleDateString("ru-RU", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
