import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAddPlaceMutation } from "../useAddPlaceMutation";
import * as insertPlaceApi from "../../api/insertPlace";
import * as uploadPhotosApi from "../../api/uploadPhotos";
import * as rollbackPlaceApi from "../../api/rollbackPlace";
import toast from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const invalidateQueriesMock = vi.fn();
const testQueryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});
testQueryClient.invalidateQueries = invalidateQueriesMock;

vi.mock("../../../../db/config", () => ({
	supabase: {},
}));

vi.mock("react-hot-toast");

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
);

describe("useAddPlaceMutation", () => {
	const params = {
		coords: [0, 0] as [number, number],
		address: { location: "Москва", route: "Тверская" },
		userUid: "user-123",
	};

	const baseFormData = {
		place_name: "Test",
		address: "Test address",
		description: "Some description",
		trip_start_date: "",
		trip_end_date: "",
		photos: [],
	};

	afterEach(() => {
		vi.clearAllMocks();
		invalidateQueriesMock.mockClear();
	});

	it("успешно добавляет место без фото", async () => {
		vi.spyOn(insertPlaceApi, "insertPlace").mockResolvedValue({
			id: "place-123",
		});
		const uploadSpy = vi.spyOn(uploadPhotosApi, "uploadPhotos");

		const { result } = renderHook(() => useAddPlaceMutation(params), {
			wrapper,
		});

		await result.current.mutateAsync(baseFormData);

		expect(insertPlaceApi.insertPlace).toHaveBeenCalled();
		expect(uploadSpy).not.toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Место успешно добавлено!");
	});
	it("успешно добавляет место с фото", async () => {
		vi.spyOn(insertPlaceApi, "insertPlace").mockResolvedValue({
			id: "place-123",
		});
		const uploadSpy = vi
			.spyOn(uploadPhotosApi, "uploadPhotos")
			.mockResolvedValue();

		const { result } = renderHook(() => useAddPlaceMutation(params), {
			wrapper,
		});

		await result.current.mutateAsync({
			...baseFormData,
			photos: [new File(["test"], "test.png", { type: "image/png" })],
		});

		expect(uploadSpy).toHaveBeenCalledWith(
			expect.anything(),
			expect.any(Array),
			"place-123",
			"user-123"
		);
	});
	it("в случае ошибки вызывает rollbackPlace", async () => {
		vi.spyOn(insertPlaceApi, "insertPlace").mockResolvedValue({
			id: "place-456",
		});
		vi.spyOn(uploadPhotosApi, "uploadPhotos").mockRejectedValue(
			new Error("storage error")
		);
		const rollbackSpy = vi
			.spyOn(rollbackPlaceApi, "rollbackPlace")
			.mockResolvedValue();

		const { result } = renderHook(() => useAddPlaceMutation(params), {
			wrapper,
		});

		await waitFor(() => {
			return expect(
				result.current.mutateAsync({
					...baseFormData,
					photos: [new File(["test"], "fail.jpg", { type: "image/jpeg" })],
				})
			).rejects.toThrow("Ошибка при добавлении места: storage error");
		});

		expect(rollbackSpy).toHaveBeenCalledWith(expect.anything(), "place-456");
	});
	it("onError показывает ошибку загрузки фотографий", async () => {
		vi.spyOn(insertPlaceApi, "insertPlace").mockResolvedValue({
			id: "place-789",
		});
		vi.spyOn(uploadPhotosApi, "uploadPhotos").mockRejectedValue(
			new Error("storage error")
		);
		vi.spyOn(rollbackPlaceApi, "rollbackPlace").mockResolvedValue();

		const { result } = renderHook(() => useAddPlaceMutation(params), {
			wrapper,
		});

		await waitFor(() => {
			return expect(
				result.current.mutateAsync({
					...baseFormData,
					photos: [new File([""], "x.png")],
				})
			).rejects.toThrow();
		});

		expect(toast.error).toHaveBeenCalledWith(
			"Ошибка загрузки фотографий. Попробуйте еще раз."
		);
	});
	it("onError показывает ошибку при сохранении места", async () => {
		vi.spyOn(insertPlaceApi, "insertPlace").mockRejectedValue(
			new Error("place insert failed")
		);

		const { result } = renderHook(() => useAddPlaceMutation(params), {
			wrapper,
		});

	await waitFor(() =>
		expect(result.current.mutateAsync(baseFormData)).rejects.toThrow()
	);

		expect(toast.error).toHaveBeenCalledWith(
			"Ошибка сохранения данных о месте. Попробуйте еще раз."
		);
	});
});
