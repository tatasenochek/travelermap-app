import { render, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe("Компонент Navigation", () => {
	it("открывает меню по клику", async () => {
		render(
			<MemoryRouter>
				<Navigation />
			</MemoryRouter>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole("button"));
		expect(
			await screen.findByRole("menuitem", { name: /главная страница/i })
		).toBeInTheDocument();
		expect(
			await screen.findByRole("menuitem", { name: /личный кабинет/i })
		).toBeInTheDocument();
	});
});
