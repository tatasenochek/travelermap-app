import { render, screen } from "@testing-library/react";
import FormTextarea from "./FormTextarea";
import { describe, expect, it } from "vitest";

describe("FormTextarea", () => {
	it("рендерит textarea с лейблом", () => {
		render(<FormTextarea label="Описание" name="description" rows={5} /> );

		expect(screen.getByLabelText("Описание")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
	});
});
