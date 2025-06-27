import { vi, describe, it, expect } from "vitest";
import { insertPlace } from "../insertPlace";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlaceFormData, LocationState } from "../../types";

const mockClient = {
	from: vi.fn(),
} as unknown as SupabaseClient;

const userUid = "user123";
const formData: PlaceFormData = {
	place_name: "Test Place",
	address: "Test Address",
	description: "Test Desc",
	trip_start_date: "2024-01-01",
	trip_end_date: "2024-01-05",
	photos: [],
};
const coords: [number, number] = [10, 20];
const address: LocationState["address"] = {
	location: "City",
	route: "Street 1",
};

describe("insertPlace", () => {
	it("Успешное выполнение insertPlace", async () => {
		const mockInsert = vi.fn().mockReturnThis();
		const mockSelect = vi.fn().mockReturnThis();
		const mockSingle = vi.fn().mockResolvedValue({
			data: { id: "place1" },
			error: null,
		});

		mockClient.from = vi.fn().mockReturnValue({
			insert: mockInsert,
			select: mockSelect,
			single: mockSingle,
		});

		const result = await insertPlace(
			mockClient,
			userUid,
			formData,
			coords,
			address
		);

		expect(mockClient.from).toHaveBeenCalledWith("places");
		expect(mockInsert).toHaveBeenCalled();
		expect(result).toEqual({ id: "place1" });
	});

	it("Ошибка при выполнении insertPlace", async () => {
		mockClient.from = vi.fn().mockReturnValue({
			insert: () => ({
				select: () => ({
					single: () =>
						Promise.resolve({ data: null, error: new Error("DB error") }),
				}),
			}),
		});

		await expect(
			insertPlace(mockClient, userUid, formData, coords, address)
		).rejects.toThrow("Ошибка при добавлении места");
	});
	it("Если поля переданы как null", async () => {
		const mockInsert = vi.fn().mockReturnThis();
		const mockSelect = vi.fn().mockReturnThis();
		const mockSingle = vi.fn().mockResolvedValue({
			data: { id: "place1" },
			error: null,
		});

		mockClient.from = vi.fn().mockReturnValue({
			insert: mockInsert,
			select: mockSelect,
			single: mockSingle,
		});

		await insertPlace(
			mockClient,
			userUid,
			{
				place_name: "Short Place",
				address: "Short Address",
			} as PlaceFormData,
			coords,
			address
		);

    expect(mockInsert).toHaveBeenCalledWith(
			expect.objectContaining({
				description: null,
				trip_start_date: null,
				trip_end_date: null,
			})
		);
	});
});
