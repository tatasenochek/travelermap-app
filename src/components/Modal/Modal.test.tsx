import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Компонент Modal", () => {
	it("Рендер модального окна и закрытие по кнопке", async () => {
		const onClose = vi.fn();

		render(
			<Modal
				isOpen={true}
				onClose={onClose}
				isConfirm={false}
				title="Тестовое модальное окно"
			>
				<div>Контент модального окна</div>
			</Modal>
		);

		expect(
			await screen.findByRole("heading", { name: /тестовое модальное окно/i })
		).toBeInTheDocument();

		expect(screen.getByText("Контент модального окна")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button"));

		expect(onClose).toHaveBeenCalled();
	});
	it("Рендер окна подтверждения и закрытие по кнопке", async () => {
		const onClose = vi.fn();
		const onCloseIsConfirmed = vi.fn();

		render(
			<Modal
				isOpen={true}
				onClose={onClose}
				isConfirm={true}
				title="Подтвердите действие"
				description="Вы уверены?"
				onCloseIsConfirmed={onCloseIsConfirmed}
			/>
		);

    expect(await screen.findByText("Вы уверены?")).toBeInTheDocument();
    
		await userEvent.click(screen.getByRole("button", { name: /да/i }));
		expect(onCloseIsConfirmed).toHaveBeenCalled();

		await userEvent.click(screen.getByRole("button", { name: /отмена/i }));
		expect(onClose).toHaveBeenCalled();

	});
});
