/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, waitFor } from "@testing-library/react";
import FormFile from "./FormFile";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-filepond", () => ({
	FilePond: ({ onupdatefiles }: any) => {
		setTimeout(() => {
			const mockFiles = [
				{ file: new File(["test"], "test.jpg", { type: "image/jpeg" }) },
			];
			onupdatefiles?.(mockFiles);
		}, 0);
		return <div data-testid="filepond-mock" />;
	},
	registerPlugin: vi.fn(),
}));


vi.mock("filepond-plugin-image-preview", () => ({
	default: {},
}));
vi.mock("filepond-plugin-image-resize", () => ({
	default: {},
}));
vi.mock("filepond-plugin-image-transform", () => ({
	default: {},
}));

describe("Компонент FormFile", () => {
	it("Установка загруженных файлов setValue", async () => {
		const mockSetValue = vi.fn();

		render(<FormFile setValue={mockSetValue} name="photos" label="Test" />);

		await waitFor(() => {
			expect(mockSetValue).toHaveBeenCalledWith("photos", [expect.any(File)], {
				shouldValidate: true,
			});
		});
	});
});
