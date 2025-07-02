/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGetPlaceById } from "../useGetPlaceById";
import { useEditPlaceMutation } from "../useEditPlaceMutation";
import { queryClient } from "../../../../store/api/queryClient";
import { useForm } from "react-hook-form";
import { useEditPlace } from "../useEditPlace";

vi.mock("../useGetPlaceById");
vi.mock("../useEditPlaceMutation");
vi.mock("react-hook-form");
vi.mock("react-router-dom", () => ({
	useNavigate: () => vi.fn(),
}));

const mockPlace = {
	id: "place-123",
	user_id: "user-456",
	place_name: "Test Place",
	description: "Test Description",
	location: "Test Location",
	trip_start_date: "2023-01-01",
	trip_end_date: "2023-01-10",
	photos: [{ id: "photo-1" }, { id: "photo-2" }],
};

const mockFormData = {
	place_name: "Updated Place",
	description: "Updated Description",
	address: "Updated Location",
	trip_start_date: "2023-02-01",
	trip_end_date: "2023-02-10",
	photos: [],
};

describe("useEditPlaceMutation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();

		(useGetPlaceById as Mock).mockReturnValue({
			place: mockPlace,
			error: null,
		});

		(useEditPlaceMutation as Mock).mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
		});

		(useForm as Mock).mockReturnValue({
			handleSubmit: (fn: any) => fn,
			reset: vi.fn(),
			formState: { isSubmitting: false },
			register: vi.fn(),
			control: {},
			watch: vi.fn(),
			setValue: vi.fn(),
			getValues: vi.fn(),
		});
	});

	it("если нет места или ошибка выбрасывает ошибку", async () => {
		(useGetPlaceById as Mock).mockReturnValue({
			place: null,
			error: new Error("Not found"),
		});

		expect(() => renderHook(() => useEditPlace())).toThrow("Место не найдено");
	});
	it("инициализирует форму с данными места и вызывает useEditPlaceMutation", async () => {
		renderHook(() => useEditPlace());

		expect(useForm).toHaveBeenCalledWith({
			resolver: expect.anything(),
			reValidateMode: "onChange",
			mode: "onTouched",
			defaultValues: {
				place_name: mockPlace.place_name,
				description: mockPlace.description,
				address: mockPlace.location,
				trip_start_date: mockPlace.trip_start_date,
				trip_end_date: mockPlace.trip_end_date,
				photos: [],
			},
		});

		expect(useEditPlaceMutation).toHaveBeenCalledWith({
			placeId: mockPlace.id,
			userId: mockPlace.user_id,
			currentPhotosCount: mockPlace.photos.length,
		});
	});
	it("инициализирует форму с пустыми значениями, когда поля place пустые", () => {
		const emptyPlace = {
			id: "place-123",
			user_id: "user-456",
			place_name: "Test Place",
			description: null,
			location: "Test location",
			trip_start_date: null,
			trip_end_date: null,
			photos: [],
		};

		(useGetPlaceById as Mock).mockReturnValue({
			place: emptyPlace,
			error: null,
		});

		renderHook(() => useEditPlace());

		expect(useForm).toHaveBeenCalledWith({
			resolver: expect.anything(),
			reValidateMode: "onChange",
			mode: "onTouched",
			defaultValues: {
				place_name: emptyPlace.place_name,
				description: "",
				address: emptyPlace.location,
				trip_start_date: "",
				trip_end_date: "",
				photos: [],
			},
		});

		expect(useEditPlaceMutation).toHaveBeenCalledWith({
			placeId: emptyPlace.id,
			userId: emptyPlace.user_id,
			currentPhotosCount: 0,
		});
	});
	it("вызывает mutateAsync при отправке формы", async () => {
		const mockMutateAsync = vi.fn().mockResolvedValue({});
		const mockReset = vi.fn();

		(useEditPlaceMutation as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
		});

		const mockEvent = {
			preventDefault: vi.fn(),
		} as unknown as React.BaseSyntheticEvent;

		(useForm as Mock).mockReturnValue({
			handleSubmit: (fn: any) => (e: React.BaseSyntheticEvent) => {
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

		const { result } = renderHook(() => useEditPlace());

		await act(async () => {
			await result.current.onSubmit(mockEvent);
		});

		expect(mockMutateAsync).toHaveBeenCalledWith(mockFormData);
		expect(mockReset).toHaveBeenCalled();
	});
});
