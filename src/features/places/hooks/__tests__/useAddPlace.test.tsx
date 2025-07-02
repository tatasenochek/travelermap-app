/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from "@testing-library/react";
import { useAddPlace } from "../useAddPlace";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { useAddPlaceMutation } from "../useAddPlaceMutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

vi.mock("react-router-dom");
vi.mock("react-redux");
vi.mock("react-hook-form");
vi.mock("@hookform/resolvers/zod");
vi.mock("../useAddPlaceMutation");

const mockState = {
	coords: [42, 42],
	address: {
		location: "Test location",
		route: "Test route",
	},
};

const mockForm = {
	handleSubmit: vi.fn((fn) => fn),
	reset: vi.fn(),
	formState: { errors: {} },
};

const mockFormData = {
	place_name: "Тест",
	description: "Описание",
	address: "Адрес",
	trip_start_date: "2023-01-01",
	trip_end_date: "2023-01-02",
	photos: [],
};

const mockMutation = {
	mutateAsync: vi.fn().mockResolvedValue({}),
	isLoading: false,
	isError: false,
};

describe("useAddPlace", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		(useLocation as Mock).mockReturnValue({
			state: mockState,
		});
		(useSelector as unknown as Mock).mockReturnValue({
			userUid: "user123",
		});
		(useForm as Mock).mockReturnValue(mockForm);
		(useAddPlaceMutation as Mock).mockReturnValue(mockMutation);
	});

	it("undefined state", () => {
		const navigate = vi.fn();
		(useNavigate as Mock).mockReturnValue(navigate);
		(useLocation as Mock).mockReturnValue({ state: undefined });
		expect(() => renderHook(() => useAddPlace())).toThrowError(
			"Недостаточно данных для сохранения"
		);
	});
	it("null state", () => {
		(useLocation as Mock).mockReturnValue({ state: null });
		expect(() => renderHook(() => useAddPlace())).toThrowError();
	});
	it("пустой объект", () => {
		(useLocation as Mock).mockReturnValue({ state: {} });
		expect(() => renderHook(() => useAddPlace())).toThrowError();
	});
	it("без coords", () => {
		(useLocation as Mock).mockReturnValue({
			state: { address: "Test address" },
		});
		expect(() => renderHook(() => useAddPlace())).toThrowError();
	});
	it("без address", () => {
		(useLocation as Mock).mockReturnValue({ state: { coords: [42, 42] } });
		expect(() => renderHook(() => useAddPlace())).toThrowError();
	});
	it("инициализирует форму с данными места и вызывает useAddPlaceMutation", async () => {
		const mockResolver = vi.fn();
		vi.mocked(zodResolver).mockReturnValue(mockResolver);
		renderHook(() => useAddPlace());

		expect(useForm).toHaveBeenCalledWith({
			resolver: expect.anything(),
			reValidateMode: "onChange",
			mode: "onTouched",
			defaultValues: {
				place_name: "",
				description: "",
				address: mockState.address.location,
				trip_start_date: "",
				trip_end_date: "",
				photos: [],
			},
		});

		expect(useAddPlaceMutation).toHaveBeenCalledWith({
			coords: mockState.coords,
			address: mockState.address,
			userUid: "user123",
		});
	});
	it("должен вызывать mutation.mutateAsync при отправке формы", async () => {
		const mockMutateAsync = vi.fn().mockResolvedValue({});
		const mockReset = vi.fn();

		(useAddPlaceMutation as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
		});

		(useForm as Mock).mockReturnValue({
			handleSubmit: (fn: any) => (e: React.FormEvent) => {
				e.preventDefault();
				fn(mockFormData);
			},
			reset: mockReset,
			formState: { isSubmitting: false },
			register: vi.fn(),
			control: {},
			watch: vi.fn(),
			setValue: vi.fn(),
			getValues: vi.fn(),
		});

		const { result } = renderHook(() => useAddPlace());

		await act(async () => {
			await result.current.onSubmit({
				preventDefault: vi.fn(),
				currentTarget: document.createElement("form"),
			} as unknown as React.FormEvent);
		});

		expect(mockMutateAsync).toHaveBeenCalledWith(mockFormData);
		expect(mockReset).toHaveBeenCalled();
	});
});
