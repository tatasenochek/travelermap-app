/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import { useAddPlace } from "../useAddPlace";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { describe, it, expect, vi } from "vitest";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { Mock } from "vitest";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useLocation: vi.fn(),
		useNavigate: vi.fn(),
	};
});

vi.mock("react-redux", async () => {
	const actual = await vi.importActual("react-redux");
	return {
		...actual,
		useSelector: vi.fn(),
	};
});

vi.mock("../useAddPlaceMutation", () => ({
	useAddPlaceMutation: vi.fn(),
}));

import { useAddPlaceMutation } from "../useAddPlaceMutation";

const mockNavigate = vi.fn();

describe("useAddPlace", () => {
	const queryClient = new QueryClient();

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	it("редиректит и кидает ошибку, если нет coords/address/userUid", () => {
		(useLocation as Mock).mockReturnValue({
			state: {
				coords: null,
				address: {},
			},
		});
		(useNavigate as Mock).mockReturnValue(mockNavigate);
		(useSelector as unknown as Mock).mockReturnValue({ userUid: undefined });

		expect(() => {
			renderHook(() => useAddPlace(), { wrapper });
		}).toThrow("Недостаточно данных для сохранения");

		expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
	});

	it("возвращает форму и onSubmit, если все данные есть", async () => {
		const mockMutateAsync = vi.fn().mockResolvedValue({});
		const mockReset = vi.fn();

		(useAddPlaceMutation as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
		});

		(useLocation as Mock).mockReturnValue({
			state: {
				coords: [10, 20],
				address: { location: "Москва", route: "Тверская" },
			},
		});
		(useNavigate as Mock).mockReturnValue(mockNavigate);
		(useSelector as unknown as Mock).mockReturnValue({ userUid: "user-123" });
		(useAddPlaceMutation as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
		});

		const { result } = renderHook(() => useAddPlace(), { wrapper });

		result.current.form.reset = mockReset;
		result.current.form.handleSubmit = (cb: any) => () =>
			cb({ place_name: "test" });

		result.current.onSubmit = result.current.form.handleSubmit(
			async (data: any) => {
				await mockMutateAsync(data);
				mockReset();
				mockNavigate("/");
			}
		);

		await act(async () => {
			await result.current.onSubmit();
		});

		expect(mockMutateAsync).toHaveBeenCalledWith({ place_name: "test" });
		expect(mockReset).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith("/");
	});
});
