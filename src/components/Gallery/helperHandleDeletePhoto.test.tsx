import { describe, it, expect, vi } from "vitest";
import { handleDeletePhoto } from "./helperHandleDeletePhoto";

describe("handleDeletePhoto", () => {
	it("не вызывает deletePhoto, если isVisible null", () => {
		const mock = vi.fn();
		handleDeletePhoto(null, mock);
		expect(mock).not.toHaveBeenCalled();
	});

	it("вызывает deletePhoto с id, если isVisible строка", () => {
		const mock = vi.fn();
		handleDeletePhoto("abc123", mock);
		expect(mock).toHaveBeenCalledWith("abc123");
	});
});
