/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";


const mockAuthReducer = (state = { userUid: null }) => state;

const renderWithRedux = (authState: any) => {
	const store = configureStore({
		reducer: { auth: mockAuthReducer },
		preloadedState: { auth: authState },
	});

	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={["/private"]}>
				<PrivateRoute>
					<div>Приватный контент</div>
				</PrivateRoute>
			</MemoryRouter>
		</Provider>
	);
};

describe("Компонент PrivateRoute", () => {
	it("Перенаправляет неавторизованных пользователей", () => {
		renderWithRedux({ userUid: null });
		expect(screen.queryByText("Приватный контент")).not.toBeInTheDocument();
	});
	it("Отображает контент для авторизованых пользователей", () => {
		renderWithRedux({ userUid: "123" });
		expect(screen.queryByText("Приватный контент")).toBeInTheDocument();
	});
});
