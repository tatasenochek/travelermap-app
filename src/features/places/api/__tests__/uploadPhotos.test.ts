/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadPhotos } from "../uploadPhotos";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUpload = vi.fn();
const mockInsert = vi.fn();
const client = {
	storage: {
		from: vi.fn(() => ({
			upload: mockUpload,
		})),
	},
	from: vi.fn(() => ({
		insert: mockInsert,
	})),
} as any;

const mockFile = new File(["test"], "test.png", { type: "image/png" });

describe("uploadPhotos", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("загружает и вставляет фото без ошибок", async () => {
		mockUpload.mockResolvedValue({ error: null });
		mockInsert.mockResolvedValue({ error: null });

		await expect(
			uploadPhotos(client, [mockFile], "place-id", "user-id")
		).resolves.toBeUndefined();

		expect(mockUpload).toHaveBeenCalledTimes(1);
		expect(mockInsert).toHaveBeenCalledTimes(1);
	});

	it("бросает ошибку, если upload не удался", async () => {
		mockUpload.mockResolvedValue({ error: new Error("upload failed") });

		await expect(
			uploadPhotos(client, [mockFile], "place-id", "user-id")
		).rejects.toThrow("Ошибка загрузки фото");

		expect(mockUpload).toHaveBeenCalled();
		expect(mockInsert).not.toHaveBeenCalled();
	});

	it("бросает ошибку, если insert не удался", async () => {
		mockUpload.mockResolvedValue({ error: null });
		mockInsert.mockResolvedValue({ error: new Error("insert failed") });

		await expect(
			uploadPhotos(client, [mockFile], "place-id", "user-id")
		).rejects.toThrow("Ошибка добавления фото");

		expect(mockUpload).toHaveBeenCalled();
		expect(mockInsert).toHaveBeenCalled();
	});
});
