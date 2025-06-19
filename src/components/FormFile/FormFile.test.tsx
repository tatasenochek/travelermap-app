import { render, waitFor } from "@testing-library/react";
import FormFile from "./FormFile";

jest.mock("react-filepond", () => {
	const originalModule = jest.requireActual("react-filepond");

	return {
		...originalModule,
		FilePond: jest.fn(({ onupdatefiles }) => {
			setTimeout(() => {
				const mockFiles = [
					{ file: new File(["test1"], "test1.jpg", { type: "image/jpeg" }) },
				];
				onupdatefiles(mockFiles);
			}, 0);
			return <div data-testid="filepond-mock" />;
		}),
		registerPlugin: jest.fn(),
	};
});

jest.mock("filepond-plugin-image-preview", () => ({}));
jest.mock("filepond-plugin-image-resize", () => ({}));
jest.mock("filepond-plugin-image-transform", () => ({}));

describe("Компонент FormFile", () => {
	it("Установка загруженных файлов setValue", async () => {
		const mockSetValue = jest.fn();

		render(<FormFile setValue={mockSetValue} name="photos" label="Test" />);

		await waitFor(() => {
			expect(mockSetValue).toHaveBeenCalledWith("photos", [expect.any(File)], {
				shouldValidate: true,
			});
		});
	});
});
