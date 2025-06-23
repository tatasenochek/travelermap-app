import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { describe, expect, it, vi } from "vitest";

describe("компонент кнопки", () => {
	it("Рендер кнопки с переданным текстом", () => {
		render(<Button title="Подсказка">Кнопка</Button>);
		const button = screen.getByRole("button", { name: /Кнопка/i });
		expect(button).toBeInTheDocument();
		expect(screen.getByTitle("Подсказка")).toBeInTheDocument();
	});
	it("Рендер с разными вариантами класса", () => {
		render(<Button variant="secondary">Кнопка</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toMatch(/secondary/);
	});
	it("Состояние loading", () => {
		render(<Button isLoading>Кнопка</Button>);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
		expect(screen.getByRole("button")).toBeDisabled();
	});
	it("Состояние disabled", () => {
		render(<Button disabled>Заблокировано</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});
	it("Обработка кликов", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Кнопка</Button>);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
