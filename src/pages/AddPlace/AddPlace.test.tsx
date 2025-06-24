/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AddPlace from "./AddPlace";
import * as addPlaceHook from "../../hooks/useAddPlace";

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

vi.mock("../../hooks/useAddPlace", () => ({
	useAddPlace: () => ({ form: formMock, onSubmit: onSubmitMock }),
}));

describe("Страница AddPlace", () => {
	it("Рендер страницы добавления места", () => {
		render(<AddPlace />);

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText(/Название путешествия/i)).toBeInTheDocument();
	});
	it("Рендер страницы добавления места, если useAddPlace===null", () => {
		vi.spyOn(addPlaceHook, "useAddPlace").mockReturnValueOnce(null);
		render(<AddPlace />);

		expect(screen.queryByRole("main")).not.toBeInTheDocument();
	});
});
