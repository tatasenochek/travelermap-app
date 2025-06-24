/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll } from "vitest";
import NotFound from "./NotFound";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";

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
					<NotFound />
				</MemoryRouter>
			</QueryClientProvider>
		</Provider>
	);
};

describe("Страница NotFound", () => {
	it("Рендер страницы", () => {
		renderWithRedux({ userUid: null })

		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(
			screen.getByText(/Упс.. К сожалению, такой страницы не найдено/i)
		).toBeInTheDocument();
	});
});
