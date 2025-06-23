import { render, screen, fireEvent } from "@testing-library/react";
import FormElement from "./FormElement";
import { describe, expect, it } from "vitest";

describe("компонент FormElement", () => {
	it("Рендер текстового поля с лейблом", () => {
		render(
			<FormElement
				label="Название поля"
				name="test"
				type="text"
				error=""
				onChange={() => {}}
			/>
		);

		expect(screen.getByLabelText("Название поля")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});
	it("Ошибка при валидации текстового поля", () => {
		render(
			<FormElement
				label="Пароль"
				name="test"
				type="text"
				error="Ошибка валидации"
				onChange={() => {}}
			/>
		);

		expect(screen.getByText("Ошибка валидации")).toBeInTheDocument();
  });
  it("Переключение видимости пароля", () => {
		render(
			<FormElement
				label="Пароль"
				name="password"
        type="password"
        error=""
				onChange={() => {}}
			/>
		);

		const input = screen.getByLabelText("Пароль");
		const toggleButton = screen.getByRole("button");

		expect(input).toHaveAttribute("type", "password");

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute("type", "text");

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute("type", "password");
  });
  it("Ошибка при валидации пароля", () => {
		render(
			<FormElement
				label="Пароль"
				name="password"
        type="password"
        error="Ошибка"
				onChange={() => {}}
			/>
		);

		expect(screen.getByText("Ошибка")).toBeInTheDocument();
	});
});
