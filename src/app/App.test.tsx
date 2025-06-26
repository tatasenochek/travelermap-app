import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, expect, it, vi } from "vitest";

vi.mock("../hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("../router/Router", () => ({
	default: () => <div data-testid="router" />,
}));

describe("App", () => {
	it("должен вызвать useAuth и отрендерить Router", () => {
		render(
				<App />
		);
		expect(screen.getByTestId("router")).toBeInTheDocument();
	});
});
