import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAddPlaceMutation } from "../useAddPlaceMutation";
import { insertPlace } from "../../api/insertPlace";
import { uploadPhotos } from "../../api/uploadPhotos";
import { rollbackPlace } from "../../api/rollbackPlace";
import toast from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../../../store/api/queryClient";
import { ReactNode } from "react";
import { supabase } from "../../../../db/config";

vi.mock("../../api/insertPlace");
vi.mock("../../api/uploadPhotos");
vi.mock("../../api/rollbackPlace");
vi.mock("react-hot-toast");
vi.mock("../../../db/config");

const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useAddPlaceMutation", () => {
	const coords = [42, 42] as [number, number];
	const address = { location: "Test location", route: "Test route" };
	const userUid = "user123";

	const formData = {
		place_name: "Test",
		address: "Test address",
		description: "Test description",
		trip_start_date: "",
		trip_end_date: "",
		photos: [],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
		invalidateQueriesSpy.mockClear();
	});

	it("успешно добавляет место без фото", async () => {
		(insertPlace as Mock).mockResolvedValueOnce({ id: "place-123" });

		const formDataWithoutPhotos = {
			place_name: "Test",
			address: "Test address",
			description: "Some description",
			trip_start_date: "",
			trip_end_date: "",
		};

		const { result } = renderHook(
			() => useAddPlaceMutation({ coords, address, userUid }),
			{ wrapper }
		);

		await result.current.mutateAsync(formDataWithoutPhotos);

		expect(insertPlace).toHaveBeenCalled();
		expect(uploadPhotos).not.toHaveBeenCalled();
	});
	it("успешно добавляет место с фото", async () => {
		(uploadPhotos as Mock).mockResolvedValueOnce(undefined);
		(insertPlace as Mock).mockResolvedValueOnce({ id: "place-123" });

		const formDataPhotos = {
			...formData,
			photos: [new File(["test"], "test.png", { type: "image/png" })],
		};

		const { result } = renderHook(
			() => useAddPlaceMutation({ coords, address, userUid }),
			{ wrapper }
		);

		await result.current.mutateAsync(formDataPhotos);

		expect(insertPlace).toHaveBeenCalledWith(
			supabase,
			userUid,
			formDataPhotos,
			coords,
			address
		);
		expect(uploadPhotos).toHaveBeenCalledWith(
			supabase,
			formDataPhotos.photos,
			"place-123",
			userUid
		);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith("Место успешно добавлено!");
		});

		expect(invalidateQueriesSpy).toHaveBeenCalledWith({
			queryKey: ["places"],
		});
		expect(invalidateQueriesSpy).toHaveBeenCalledWith({
			queryKey: ["photos"],
		});
	});
	it("в случае ошибки вызывает rollbackPlace", async () => {
		(insertPlace as Mock).mockResolvedValueOnce({ id: "place-123" });
		(uploadPhotos as Mock).mockRejectedValueOnce(new Error("storage error"));
		(rollbackPlace as Mock).mockResolvedValueOnce(undefined);

		const formDataPhotos = {
			...formData,
			photos: [new File(["test"], "photo.jpg")],
		};

		const { result } = renderHook(
			() => useAddPlaceMutation({ coords, address, userUid }),
			{
				wrapper,
			}
		);

		await expect(result.current.mutateAsync(formDataPhotos)).rejects.toThrow();

		expect(rollbackPlace).toHaveBeenCalledWith(supabase, "place-123");

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"Ошибка загрузки фотографий. Попробуйте еще раз."
			);
		});
	});
	it("пробрасывает ошибку если placeId не был создан", async () => {
		(insertPlace as Mock).mockRejectedValueOnce(
			new Error("DB connection error")
		);

		const { result } = renderHook(
			() => useAddPlaceMutation({ coords, address, userUid }),
			{ wrapper }
		);

		await expect(result.current.mutateAsync(formData)).rejects.toThrow(
			"DB connection error"
		);

		expect(rollbackPlace).not.toHaveBeenCalled();

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"Не удалось добавить место. Попробуйте еще раз."
			);
		});
	});
	it("показывает сообщение об ошибке place", async () => {
		(insertPlace as Mock).mockRejectedValueOnce(
			new Error("place insert error")
		);

		const { result } = renderHook(
			() => useAddPlaceMutation({ coords, address, userUid }),
			{ wrapper }
		);

		await expect(result.current.mutateAsync(formData)).rejects.toThrow();

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"Ошибка сохранения данных о месте. Попробуйте еще раз."
			);
		});
	});
});
