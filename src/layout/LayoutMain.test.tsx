import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LayoutMain from "./LayoutMain";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../components/Header/Header", () => ({
	default: () => <div data-testid="header">Mock Header</div>,
}));


describe("LayoutMain", () => {
	it("Рендер LayoutMain", () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route element={<LayoutMain />}>
						<Route
							index
							element={<div data-testid="outlet">Outlet Content</div>}
						/>
					</Route>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByTestId("header")).toBeInTheDocument();
		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});
});
