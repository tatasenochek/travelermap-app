/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import { queryClient } from "../../store/api/queryClient";
import { MemoryRouter } from "react-router-dom";
import Place from "./Place";
import * as usePlaceHook from "../../hooks/useGetPlaceById";
import { ROUTES } from "../../router/ROUTES";
import { IPlace } from "../../hooks/useGetPlaceById";

const deletePlaceMock = vi.fn();
const useGetPlaceByIdMock = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../hooks/useDeletePlace", () => ({
	useDeletePlace: () => ({ deletePlace: deletePlaceMock }),
}));

vi.mock("../../hooks/useGetPlaceById", () => ({
	useGetPlaceById: () => useGetPlaceByIdMock(),
}));

vi.mock("../../components/Gallery/Gallery", () => ({
	default: () => <div data-testid="gallery">Gallery</div>,
}));

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useLocation: () => ({ pathname: "/" }),
	};
});

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
					<Place />
				</MemoryRouter>
			</QueryClientProvider>
		</Provider>
	);
};

describe("Страница PersonalAccount", () => {
  let placeMock: IPlace | undefined = {
		id: "1",
		user_id: "123",
		place_name: "Москва Сити",
		address: { location: "Москва", route: "Пресненская набережная, 2" },
		description: "Описание",
		trip_start_date: "2024-06-01",
		trip_end_date: "2024-06-10",
		coords: [55.748932283424, 37.5395865400724] as [number, number],
		created_at: "2025-06-16T08:28:36.492",
		location: "Москва",
		route: "Пресненская набережная, 2",
		photos: [],
	};

	it("Рендер страницы, для авторизированного пользователя, но не владельца записи", () => {
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: null,
		});

		renderWithRedux({ userUid: "124", userName: "Tata" });

		expect(screen.getByTestId("place-page")).toBeInTheDocument();
	});
	it("Рендер страницы, для авторизированного пользователя и владельца записи", () => {
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: null,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(screen.getByTestId("place-page")).toBeInTheDocument();
		expect(screen.getByTestId("place-аction")).toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", {
				name: /Редактировать/i,
			})
		);
		expect(mockNavigate).toHaveBeenCalledWith(
			`${ROUTES.EDIT_PLACE}/1`,
			expect.objectContaining({
				state: expect.objectContaining({
					backgroundPath: "/",
				}),
			})
		);
	});
	it("Открытие окна подтвреждения для удаления, с результатом отмена", () => {
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: null,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		fireEvent.click(
			screen.getByRole("button", {
				name: /Удалить/i,
			})
		);

		expect(screen.getByText(/Подтвердите удаление/i)).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", {
				name: /Отмена/i,
			})
		);

		expect(deletePlaceMock).not.toHaveBeenCalled();
	});
	it("Открытие окна подтвреждения для удаления, с результатом да", () => {
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: null,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });
		fireEvent.click(
			screen.getByRole("button", {
				name: /Удалить/i,
			})
		);

		expect(screen.getByText(/Подтвердите удаление/i)).toBeInTheDocument();

		fireEvent.click(
			screen.getAllByRole("button", {
				name: /Да/i,
			})[2]
		);

		expect(deletePlaceMock).toHaveBeenCalledWith("1");
	});
	it("Рендер страницы, если place===undefined", () => {
		placeMock = undefined;
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: null,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(screen.getByText(/Место не найдено/)).toBeInTheDocument();
	});
	it("Загрузка страницы", () => {
		placeMock = undefined;
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: true,
			error: null,
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(screen.getByTestId("place-loader")).toBeInTheDocument();
	});
	it("Рендер страницы, если error===new Error()", () => {
		placeMock = undefined;
		vi.spyOn(usePlaceHook, "useGetPlaceById").mockReturnValue({
			place: placeMock,
			isLoading: false,
			error: new Error(),
		});

		renderWithRedux({ userUid: "123", userName: "Tata" });

		expect(
			screen.getByText(/Ошибка загрузки места. Попробуйте позже./)
		).toBeInTheDocument();
	});
});
