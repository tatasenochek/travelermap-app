import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { queryClient } from "../../../../store/api/queryClient";
import { useEditPlaceMutation } from "../useEditPlaceMutation";
import { updatePlace } from "../../api/updatePlace";
import { uploadPhotos } from "../../api/uploadPhotos";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../../db/config";

vi.mock("../../api/updatePlace");
vi.mock("../../api/uploadPhotos");
vi.mock("react-hot-toast");
vi.mock("../../../db/config");

const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useEditPlaceMutation", () => {
	const placeId = "place-123";
	const userId = "user-456";
	const currentPhotosCount = 2;

	const formData = {
		place_name: "Test",
		address: "Test address",
		description: "Some description",
		trip_start_date: "",
		trip_end_date: "",
		photos: [],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
		invalidateQueriesSpy.mockClear();
	});

	it("успешно редактирует место без фото", async () => {
		(updatePlace as Mock).mockResolvedValueOnce(undefined);


		const formDataWithoutPhotos = {
			place_name: "Test",
			address: "Test address",
			description: "Some description",
			trip_start_date: "",
			trip_end_date: "",
		};

		const { result } = renderHook(
			() => useEditPlaceMutation({ placeId, userId, currentPhotosCount }),
			{ wrapper }
		);

		await result.current.mutateAsync(formDataWithoutPhotos);

		expect(updatePlace).toHaveBeenCalled();
		expect(uploadPhotos).not.toHaveBeenCalled();
	});
	it("успешно редактирует место с фото", async () => {
		(uploadPhotos as Mock).mockResolvedValueOnce(undefined);
		(updatePlace as Mock).mockResolvedValueOnce(undefined);

		const formDataPhotos = {
			...formData,
			photos: [new File(["test"], "test.png", { type: "image/png" })],
		};

		const { result } = renderHook(
			() => useEditPlaceMutation({ placeId, userId, currentPhotosCount }),
			{ wrapper }
		);

		await result.current.mutateAsync(formDataPhotos);

		expect(updatePlace).toHaveBeenCalledWith(
			supabase,
			formDataPhotos,
			formDataPhotos.address,
			placeId
		);
		expect(uploadPhotos).toHaveBeenCalledWith(
			supabase,
			formDataPhotos.photos,
			placeId,
			userId
		);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Место успешно отредактировано!"
			);
		});

		expect(invalidateQueriesSpy).toHaveBeenCalledWith({
			queryKey: ["places"],
		});
		expect(invalidateQueriesSpy).toHaveBeenCalledWith({
			queryKey: ["photos"],
		});
	});
	it("ошибка редактирования, если добавлено больше 5 фотографий", async () => {
		const currentPhotosCount = 5;
		(uploadPhotos as Mock).mockResolvedValueOnce(undefined);
		(updatePlace as Mock).mockResolvedValueOnce(undefined);

		const formDataPhotos = {
			...formData,
			photos: [new File(["test"], "test.png", { type: "image/png" })],
		};

		const { result } = renderHook(
			() => useEditPlaceMutation({ placeId, userId, currentPhotosCount }),
			{ wrapper }
		);

		await expect(result.current.mutateAsync(formDataPhotos)).rejects.toThrow(
			"Превышен лимит фотографий"
		);
	});
	it("ошибка при сохранении фотографий", async () => {
		const currentPhotosCount = 2;
		(uploadPhotos as Mock).mockRejectedValueOnce(new Error("storage error"));
		(updatePlace as Mock).mockResolvedValueOnce(undefined);

		const formDataPhotos = {
			...formData,
			photos: [new File([""], "x.png")],
		};

		const { result } = renderHook(
			() => useEditPlaceMutation({ placeId, userId, currentPhotosCount }),
			{ wrapper }
		);

		await waitFor(() => {
			return expect(
				result.current.mutateAsync(formDataPhotos)
			).rejects.toThrow();
		});

		expect(toast.error).toHaveBeenCalledWith(
			"Ошибка загрузки фотографий. Попробуйте еще раз."
		);
	});
	it("ошибка при сохранении обновленного места", async () => {
		(uploadPhotos as Mock).mockResolvedValueOnce(undefined);
		(updatePlace as Mock).mockRejectedValueOnce(new Error("place error"));

		const { result } = renderHook(
			() => useEditPlaceMutation({ placeId, userId, currentPhotosCount }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.mutateAsync(formData)).rejects.toThrow();
		});

		expect(toast.error).toHaveBeenCalledWith(
			"Ошибка сохранения данных о месте. Попробуйте еще раз."
		);
	});
});
