import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, } from "vitest";
import Home from "./Home";

vi.mock("../../components/Map/Map", () => ({
	default: () => <div data-testid="yandex-map" />,
}));

describe("Страница NotFound", () => {
	it("Рендер страницы", () => {
		render(<Home />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("yandex-map")).toBeInTheDocument();
	});
});
