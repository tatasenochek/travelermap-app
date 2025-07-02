/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import EditPlace from "./EditPlace";
import PlaceForm from "../../components/PlaceForm/PlaceForm";
import { useEditPlace } from "../../features/places/hooks/useEditPlace";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";

vi.mock("react-hot-toast");
vi.mock("../../components/PlaceForm/PlaceForm");
vi.mock("../../features/places/hooks/useEditPlace");

const mockAuthReducer = (state = { userUid: null }) => state;

const renderWithRedux = (authState: any) => {
	const store = configureStore({
		reducer: { auth: mockAuthReducer },
		preloadedState: { auth: authState },
	});

	return render(
		<MemoryRouter
			initialEntries={[
				{
					pathname: "/edit-place",
					state: {
						coords: [10, 20],
						address: { location: "Москва", route: "Тверская" },
					},
				},
			]}
		>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<EditPlace />
				</QueryClientProvider>
			</Provider>
		</MemoryRouter>
	);
};

describe("страница EditPlace", () => {
	const mockForm = {
		register: vi.fn(),
		handleSubmit: vi.fn((fn) => fn),
		formState: { errors: {} },
		reset: vi.fn(),
	};

	const mockUseEditPlace = {
		form: mockForm,
		onSubmit: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(PlaceForm as Mock).mockImplementation(({ form, onSubmit }) => (
			<div>
				<button onClick={form.handleSubmit(onSubmit)}>Submit</button>
			</div>
		));
	});

	it("показывает toast при ошибке", () => {
		(useEditPlace as Mock).mockReturnValue(null);

		renderWithRedux({ userUid: "123" });

		expect(toast.error).toHaveBeenCalledWith(
			"Не удалось загрузить данные места"
		);
	});
	it("вызывает onSubmit при отправке формы", async () => {
		(useEditPlace as Mock).mockReturnValue(mockUseEditPlace);
		renderWithRedux({ userUid: "123" });

		await userEvent.click(screen.getByText("Submit"));
		expect(mockUseEditPlace.onSubmit).toHaveBeenCalled();
	});
	
});
