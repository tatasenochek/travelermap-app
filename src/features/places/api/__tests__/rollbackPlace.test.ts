/* eslint-disable @typescript-eslint/no-explicit-any */
import { rollbackPlace } from "../rollbackPlace";
import { vi, describe, it, expect } from "vitest";

const mockClient = {
	from: vi.fn(),
	storage: {
		from: vi.fn(() => ({
			remove: vi.fn(),
		})),
	},
} as any;

describe("rollbackPlace", () => {
	it("удаляет фотографии из storage и записи из таблиц, если фото есть", async () => {
		const mockRemove = vi.fn().mockResolvedValue({});
		const mockDelete = vi.fn().mockResolvedValue({});
		const mockSelect = vi.fn().mockReturnValue({
			eq: vi.fn().mockResolvedValue({
				data: [
					{ image_path: "photos/test1.jpg" },
					{ image_path: "photos/test2.jpg" },
				],
			}),
		});
		mockClient.from = vi.fn((table: string) => {
			if (table === "photos") {
				return {
					select: mockSelect,
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			if (table === "places") {
				return {
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			return {} as any;
		});
		mockClient.storage.from = vi.fn(() => ({
			remove: mockRemove,
		}));

		await rollbackPlace(mockClient, "place-123");

		expect(mockSelect).toHaveBeenCalled();
		expect(mockRemove).toHaveBeenCalledWith([
			"photos/test1.jpg",
			"photos/test2.jpg",
		]);
		expect(mockDelete).toHaveBeenCalledTimes(2); // photos and places
	});

	it("не вызывает remove, если фото нет", async () => {
		const mockDelete = vi.fn().mockResolvedValue({});
		const mockSelect = vi.fn().mockReturnValue({
			eq: vi.fn().mockResolvedValue({
				data: [],
			}),
		});
		mockClient.from = vi.fn((table: string) => {
			if (table === "photos") {
				return {
					select: mockSelect,
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			if (table === "places") {
				return {
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			return {} as any;
		});
		const mockRemove = vi.fn();
		mockClient.storage.from = vi.fn(() => ({
			remove: mockRemove,
		}));

		await rollbackPlace(mockClient, "place-123");

		expect(mockRemove).not.toHaveBeenCalled();
		expect(mockDelete).toHaveBeenCalledTimes(2); // удаление из photos и places
	});

	it("не вызывает remove, если photos === null", async () => {
		const mockDelete = vi.fn().mockResolvedValue({});
		const mockSelect = vi.fn().mockReturnValue({
			eq: vi.fn().mockResolvedValue({
				data: null,
			}),
		});
		mockClient.from = vi.fn((table: string) => {
			if (table === "photos") {
				return {
					select: mockSelect,
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			if (table === "places") {
				return {
					delete: () => ({
						eq: mockDelete,
					}),
				};
			}
			return {} as any;
		});
		const mockRemove = vi.fn();
		mockClient.storage.from = vi.fn(() => ({
			remove: mockRemove,
		}));

		await rollbackPlace(mockClient, "place-123");

		expect(mockRemove).not.toHaveBeenCalled();
		expect(mockDelete).toHaveBeenCalledTimes(2);
	});
});
