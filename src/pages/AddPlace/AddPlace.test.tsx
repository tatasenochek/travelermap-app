/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddPlace from "./AddPlace";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";
import { configureStore } from "@reduxjs/toolkit";

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
					pathname: "/add-place",
					state: {
						coords: [10, 20],
						address: { location: "Москва", route: "Тверская" },
					},
				},
			]}
		>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<AddPlace />
				</QueryClientProvider>
			</Provider>
		</MemoryRouter>
	);
};

describe("Страница AddPlace", () => {
	it("Рендер страницы добавления места", () => {
		renderWithRedux({ userUid: "123" });

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByText(/Название путешествия/i)).toBeInTheDocument();
	});
});
