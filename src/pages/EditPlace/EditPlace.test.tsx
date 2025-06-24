/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as editPlaceHook from "../../hooks/useEditPlace";
import EditPlace from "./EditPlace";

const formMock = {
	register: vi.fn(() => ({
		name: "place_name",
		onChange: vi.fn(),
		onBlur: vi.fn(),
		ref: vi.fn(),
	})),
	formState: {
		errors: {},
	},
} as any;

const onSubmitMock = vi.fn();

vi.mock("../../hooks/useEditPlace", () => ({
	useEditPlace: () => ({ form: formMock, onSubmit: onSubmitMock }),
}));

describe("Страница EditPlace", () => {
	it("Рендер страницы редактирования места", () => {
		render(<EditPlace />);

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText(/Название путешествия/i)).toBeInTheDocument();
	});
	it("Рендер страницы редактирования места, если useEditPlace===null", () => {
		vi.spyOn(editPlaceHook, "useEditPlace").mockReturnValueOnce(null);
		render(<EditPlace />);

		expect(screen.queryByRole("main")).not.toBeInTheDocument();
	});
});
