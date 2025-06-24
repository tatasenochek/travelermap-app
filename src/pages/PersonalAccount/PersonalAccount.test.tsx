/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PersonalAccount from "./PersonalAccount";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";
import { MemoryRouter } from "react-router-dom";
import * as getAllPlacesHook from "../../hooks/useGetAllPlaces";

vi.mock("../../hooks/useGetAllPlaces", () => ({
	useGetAllPlaces: vi.fn(() => ({
		places: [
			{
				id: "1",
				user_id: "123",
				title: "Москва Сити",
			},
		],
	})),
}));

const mockAuthReducer = (state = { userUid: null }) => state;

const renderWithRedux = (authState: any) => {
	const store = configureStore({
		reducer: { auth: mockAuthReducer },
		preloadedState: { auth: authState },
	});

	return render(
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<PersonalAccount />
				</MemoryRouter>
			</QueryClientProvider>
		</Provider>
	);
};

describe("Страница PersonalAccount", () => {
	it("Рендер страницы", () => {
		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText(/Информация о путешествиях/i)).toBeInTheDocument();
		expect(screen.getByText(/Москва Сити/i)).toBeInTheDocument();
	});
	it("Рендер страницы, если userUid===null", () => {
		renderWithRedux({ userUid: null });

		expect(screen.queryByRole("main")).not.toBeInTheDocument();
  });
  it("Рендер страницы, если places===undefined", () => {
		vi.spyOn(getAllPlacesHook, "useGetAllPlaces").mockReturnValueOnce({
			places: undefined,
			isLoading: false,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(screen.queryByRole("main")).not.toBeInTheDocument();
	});
});
