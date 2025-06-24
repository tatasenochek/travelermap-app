import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Signin from "./Signin";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useSignin", () => ({
	useSignin: () => ({
		register: vi.fn(() => ({})),
		errors: { email: { message: "Некорректная почта" } },
		isValid: true,
		isSubmitting: false,
		onSubmit: vi.fn(),
	}),
}));

describe("Страница Signin", () => {
	it("Рендер страницы авторизации", () => {
		render(
			<MemoryRouter>
				<Signin />
			</MemoryRouter>
		);

		expect(screen.getByTestId("signin-page")).toBeInTheDocument();
	});
});
