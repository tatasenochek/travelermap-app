/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";
import { Provider } from "react-redux";
import { describe, expect, it, vi, beforeAll } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

const logoutMock = vi.fn();

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

vi.mock("../../hooks/useLogout", () => ({
	useLogout: () => ({ mutate: logoutMock, isPending: false }),
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
					<Header />
				</MemoryRouter>
			</QueryClientProvider>
		</Provider>
	);
};

describe("Компонент Header", () => {
	it("Рендер компонента если не авторизированный пользователь", () => {
		renderWithRedux({ userUid: null });

		expect(screen.getByText(/Войти/i)).toBeInTheDocument();
		expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
	});
	it("Рендер компонента если авторизированный пользователь", () => {
		renderWithRedux({ userUid: "123", userName: "Tata", isAuth: true });

		expect(screen.getByRole("button", { name: /выйти/i })).toBeInTheDocument();
		expect(screen.getByText(/Tata/i)).toBeInTheDocument();
	});
	it("Открытие окна подтвреждения выхода из сессии, с результатом отмена", () => {
		renderWithRedux({ userUid: "123", userName: "Tata", isAuth: true });

		const logoutButton = screen.getByRole("button", { name: /выйти/i });

		fireEvent.click(logoutButton);

		expect(
			screen.getByText(/Вы действительно хотите выйти из личного кабинета?/i)
		).toBeInTheDocument();

		const cancelButton = screen.getByRole("button", {
			name: /Отмена/i,
		});
		fireEvent.click(cancelButton);
		expect(logoutMock).not.toHaveBeenCalled();
  });
  it("Открытие окна подтвреждения выхода из сессии, с результатом да", () => {
		renderWithRedux({ userUid: "123", userName: "Tata", isAuth: true });

		const logoutButton = screen.getByRole("button", { name: /выйти/i });

		fireEvent.click(logoutButton);

		expect(
			screen.getByText(/Вы действительно хотите выйти из личного кабинета?/i)
		).toBeInTheDocument();

		const confirmButton = screen.getByRole("button", {
			name: /Да/i,
		});
		fireEvent.click(confirmButton);
		expect(logoutMock).toHaveBeenCalled();
	});
});
