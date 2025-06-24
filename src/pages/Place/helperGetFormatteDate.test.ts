import { describe, expect, it } from "vitest";
import { getFormattedDate } from "./helperGetFormatteDate";

describe("Функция getFormattedDate", () => {
	it("должна вернуть отформатированную дату в формате ru-RU", () => {
		const input = "2024-06-15";
		const result = getFormattedDate(input);

		expect(result).toMatch(/\d{1,2} \p{L}+ 2024 г\./u);
	});

	it("должна вернуть undefined, если дата null", () => {
		const result = getFormattedDate(null);
		expect(result).toBeUndefined();
	});

	it("должна вернуть undefined, если дата пустая строка", () => {
		const result = getFormattedDate("");
		expect(result).toBeUndefined();
	});
});
