/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LayoutModal from "./LayoutModal";
import userEvent from "@testing-library/user-event";
import * as reactRouter from "react-router-dom";
import { ROUTES } from "../router/ROUTES";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useLocation: () => ({ state: { backgroundPath: "/test" } }),
	};
});

describe("LayoutModal", () => {
  const Component = () => <div data-testid="component">Component</div>;

	it("Рендер LayoutModal", async () => {
		
		render(
			<MemoryRouter initialEntries={["/"]}>
				<LayoutModal title="test" Component={Component}>
					<p>TEST</p>
				</LayoutModal>
			</MemoryRouter>
		);

		expect(screen.getByText("TEST")).toBeInTheDocument();
		expect(screen.getByTestId("component")).toBeInTheDocument();

		const closeButton = screen.getByRole("button", { name: /Закрыть/i });

		await userEvent.click(closeButton);

		expect(mockNavigate).toHaveBeenCalledWith("/test", {
			replace: true,
		});
	});
	it("Рендер LayoutModal, если backgroundPath задан явно", async () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<LayoutModal
					title="test"
					Component={Component}
					backgroundPath="/test-path"
				>
					<p>TEST</p>
				</LayoutModal>
			</MemoryRouter>
		);

		expect(screen.getByText("TEST")).toBeInTheDocument();
		expect(screen.getByTestId("component")).toBeInTheDocument();

		const closeButton = screen.getByRole("button", { name: /Закрыть/i });

		await userEvent.click(closeButton);

		expect(mockNavigate).toHaveBeenCalledWith("/test", {
			replace: true,
		});
	});
	it("Рендер LayoutModal, с навигацией по умолчанию на главную", async () => {
		vi.spyOn(reactRouter, "useLocation").mockReturnValue({} as any);

		render(
			<MemoryRouter initialEntries={[ROUTES.HOME]}>
				<LayoutModal title="test" Component={Component}>
					<p>TEST</p>
				</LayoutModal>
			</MemoryRouter>
		);

		expect(screen.getByText("TEST")).toBeInTheDocument();
		expect(screen.getByTestId("component")).toBeInTheDocument();

		const closeButton = screen.getByRole("button", { name: /Закрыть/i });

		await userEvent.click(closeButton);

		expect(mockNavigate).toHaveBeenCalledWith("/test", {
			replace: true,
		});
	});
});
