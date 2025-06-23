/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Gallery from "./Gallery";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const deletePhotoMock = vi.fn();
const useGetPlaceByIdMock = vi.fn();

vi.mock("../../hooks/useDeletePhoto", () => ({
	useDeletePhoto: () => ({ deletePhoto: deletePhotoMock }),
}));

vi.mock("../../hooks/useGetPlaceById", () => ({
	useGetPlaceById: () => useGetPlaceByIdMock(),
}));

vi.mock("../../db/config", () => ({
	supabase: {
		storage: {
			from: () => ({
				getPublicUrl: (path: string) => ({
					data: { publicUrl: `https://fake-url.com/${path}` },
				}),
			}),
		},
	},
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
				<Gallery />
			</QueryClientProvider>
		</Provider>
	);
};

describe("Компонент Gallery", () => {
	beforeEach(() => {
		useGetPlaceByIdMock.mockReturnValue({
			place: {
				user_id: "123",
				place_name: "Test Place",
				photos: [{ id: "1", image_path: "test.jpg" }],
			},
		});
		vi.clearAllMocks();
	});
	it("Рендер компонента если не авторизированный пользователь", () => {
		renderWithRedux({ userUid: null });

		expect(
			screen.queryByText(/Авторизируйтесь, что бы смотреть фотографии/)
		).toBeInTheDocument();
	});
	it("Рендер фотографий, если пользователь авторизован", () => {
		renderWithRedux({ userUid: "123" });

		expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
	});
	it("Открытие окна подтвреждения для удаления", () => {
		renderWithRedux({ userUid: "123" });

		const deleteButtons = screen.getAllByRole("button");
		fireEvent.click(deleteButtons[0]);

		expect(screen.getByText(/Подтвердите удаление/i)).toBeInTheDocument();
	});
	it("Открытие окна подтвреждения для удаления, с результатом отмена", () => {
		renderWithRedux({ userUid: "123" });

		const deleteButtons = screen.getAllByRole("button");
		fireEvent.click(deleteButtons[0]);

		expect(screen.getByText(/Подтвердите удаление/i)).toBeInTheDocument();

		const cancelButton = screen.getByRole("button", {
			name: /Отмена/i,
		});
		fireEvent.click(cancelButton);
		expect(deletePhotoMock).not.toHaveBeenCalled();
	});
	it("Открытие окна подтвреждения для удаления, с результатом да", () => {
		renderWithRedux({ userUid: "123" });

		const deleteButtons = screen.getAllByRole("button");
		fireEvent.click(deleteButtons[0]);

		expect(screen.getByText(/Подтвердите удаление/i)).toBeInTheDocument();

		const confirmButton = screen.getByRole("button", {
			name: /Да/i,
		});
		fireEvent.click(confirmButton);
		expect(deletePhotoMock).toHaveBeenCalledWith("1");
	});
	it("Если фотографий нет", () => {
		useGetPlaceByIdMock.mockReturnValueOnce({
			place: {
				user_id: "123",
				place_name: "Test Place",
				photos: [],
			},
		});

		renderWithRedux({ userUid: "123" });

		expect(screen.getByText(/Нет фотографий/i)).toBeInTheDocument();
	});
	it("Если imageUrl будет пустой строкой", () => {
		useGetPlaceByIdMock.mockReturnValueOnce({
			place: {
				user_id: "123",
				place_name: "Test Place",
				photos: [{ id: "2", image_path: "" }],
			},
		});

		renderWithRedux({ userUid: "123" });

		expect(screen.getByRole("img").getAttribute("src")).toBe(null);
	});
});
