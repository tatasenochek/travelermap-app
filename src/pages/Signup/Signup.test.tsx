import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Signup from "./Signup";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useSignup", () => ({
	useSignup: () => ({
		register: vi.fn(() => ({})),
		errors: { email: { message: "Некорректная почта" } },
		isValid: true,
		isSubmitting: false,
		onSubmit: vi.fn(),
	}),
}));

describe("Страница Signup", () => {
	it("Рендер страницы авторизации", () => {
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		expect(screen.getByTestId("signup-page")).toBeInTheDocument();
	});
});
