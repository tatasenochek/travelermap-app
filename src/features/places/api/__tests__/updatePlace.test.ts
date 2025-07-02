import { vi, describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlaceFormData } from "../../types";
import { updatePlace } from "../updatePlace";

const mockEq = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

const mockClient = { from: mockFrom } as unknown as SupabaseClient;

const formData: PlaceFormData = {
	place_name: "Test Place",
	address: "Test Address",
	description: "Test Desc",
	trip_start_date: "2024-01-01",
	trip_end_date: "2024-01-05",
	photos: [],
};

const address = "City";

const placeId = "place1";

describe("updatePlace", () => {
	it("Успешное выполнение updatePlace", async () => {
		await updatePlace(mockClient, formData, address, placeId);

		expect(mockClient.from).toHaveBeenCalledWith("places");
		expect(mockUpdate).toHaveBeenCalledWith({
			place_name: formData.place_name,
			description: formData.description,
			location: address,
			trip_start_date: formData.trip_start_date,
			trip_end_date: formData.trip_end_date,
		});
		expect(mockEq).toHaveBeenCalledWith("id", placeId);
	});
	it("Если поля переданы как null", async () => {
		await updatePlace(
			mockClient,
			{
				place_name: "Test Place",
				address: "Test Address",
				description: undefined,
				trip_start_date: undefined,
				trip_end_date: undefined,
			} as PlaceFormData,
			address,
			placeId
		);

		expect(mockUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				description: null,
				trip_start_date: null,
				trip_end_date: null,
			})
		);
	});
	it("Должен выбрасывать ошибку при неудачном обновлении", async () => {
		const error = new Error("Update failed");
		const failingMockClient = {
			from: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			eq: vi.fn().mockResolvedValue({ error }),
		} as unknown as SupabaseClient;

		mockClient.from = vi.fn().mockReturnValue({
			update: () => ({
				eq: () => Promise.reject({ error }),
			}),
		});

		await expect(
			updatePlace(failingMockClient, formData, address, placeId)
		).rejects.toThrow("Ошибка при редактировании места");
	});
});
