import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "./ErrorPage";

describe("Страница ErrorPage", () => {
	it("Рендер страницы", () => {
		render(<ErrorPage />);

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText(/Упс! Ошибка/i)).toBeInTheDocument();
	});
	it("Перезагрузка страницы при клике", () => {
		const reloadMock = vi.fn();
		Object.defineProperty(window, "location", {
			value: { reload: reloadMock },
			writable: true,
		});

		render(<ErrorPage />);

		fireEvent.click(
			screen.getByRole("button", {
				name: /Обновить/i,
			})
		);
		expect(reloadMock).toHaveBeenCalled();
	});
});
