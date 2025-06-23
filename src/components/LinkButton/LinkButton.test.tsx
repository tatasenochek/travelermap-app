import { render, screen } from "@testing-library/react";
import LinkButton from "./LinkButton";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Компонент LinkButton", () => {
	it("Рендер компонента с переданным текстом", () => {
    render(
			<MemoryRouter>
				<LinkButton to="/test">Тест</LinkButton>
			</MemoryRouter>
		);

		expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
		expect(screen.getByText("Тест")).toBeInTheDocument();
	});
});
