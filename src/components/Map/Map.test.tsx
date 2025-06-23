/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";
import { geocodeMock, mockNavigate, toastMock } from "./mocks";

// 🟢 Мокаем toast до всего
vi.mock("react-hot-toast", () => ({
	__esModule: true,
	default: Object.assign(toastMock, { error: toastMock }),
}));

// 🟢 Мокаем react-router-dom
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useLocation: () => ({ pathname: "/" }),
	};
});

// 🟢 Мокаем react-yandex-maps
vi.mock("@pbe/react-yandex-maps", () => ({
	Map: ({ children, onClick }: any) => (
		<div
			data-testid="yandex-map"
			onClick={() => onClick({ get: () => [59.9, 30.3] })}
		>
			{children}
		</div>
	),
	Placemark: ({ onClick }: any) => (
		<div data-testid="placemark" onClick={onClick} />
	),
	Clusterer: ({ children }: any) => <div>{children}</div>,
	useYMaps: () => ({ geocode: geocodeMock }),
}));

// 🟢 Мокаем хук useGetAllPlaces
vi.mock("../../hooks/useGetAllPlaces", () => ({
	useGetAllPlaces: vi.fn(),
}));
const mockedUseGetAllPlaces = useGetAllPlaces as unknown as ReturnType<
	typeof vi.fn
>;

import YandexMap from "./Map";
import { describe, expect, it, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { YMaps } from "react-yandex-maps";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../store/api/queryClient";
import { useGetAllPlaces } from "../../hooks/useGetAllPlaces";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../../router/ROUTES";
import * as reactYMaps from "@pbe/react-yandex-maps";

describe("Компонент YandexMap", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("Показывает спинер при загрузке", () => {
		mockedUseGetAllPlaces.mockReturnValueOnce({
			places: [],
			isLoading: true,
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByTestId("loader")).toBeInTheDocument();
	});

	it("Рендерит карту, когда загрузка завершена", () => {
		mockedUseGetAllPlaces.mockReturnValueOnce({
			places: [{ id: "1", coords: [59.9, 30.3] }],
			isLoading: false,
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByTestId("yandex-map")).toBeInTheDocument();
	});

	it("Обрабатывает клик по карте — успешный геокод", async () => {
		mockedUseGetAllPlaces.mockReturnValue({
			places: [],
			isLoading: false,
		});

		geocodeMock.mockResolvedValueOnce({
			geoObjects: {
				get: vi.fn(() => ({
					properties: {
						get: vi.fn((key: string) =>
							key === "description"
								? "Test City"
								: key === "name"
								? "Test Street"
								: ""
						),
					},
				})),
			},
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await userEvent.click(screen.getByTestId("yandex-map"));

		expect(mockNavigate).toHaveBeenCalledWith(
			ROUTES.ADD_PLACE,
			expect.objectContaining({
				state: expect.objectContaining({
					coords: [59.9, 30.3],
					address: {
						location: "Test City",
						route: "Test Street",
					},
				}),
			})
		);
	});

	it("Показывает toast, если geocodeResult не найден", async () => {
		mockedUseGetAllPlaces.mockReturnValue({
			places: [],
			isLoading: false,
		});

		geocodeMock.mockResolvedValueOnce({
			geoObjects: {
				get: vi.fn(() => null),
			},
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await userEvent.click(screen.getByTestId("yandex-map"));

		expect(toastMock).toHaveBeenCalledWith("Не удалось определить адрес");
	});

	it("Показывает toast при ошибке геокодирования (catch)", async () => {
		mockedUseGetAllPlaces.mockReturnValue({
			places: [],
			isLoading: false,
		});

		geocodeMock.mockRejectedValueOnce(new Error("Geocode error"));

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await userEvent.click(screen.getByTestId("yandex-map"));

		expect(toastMock).toHaveBeenCalledWith(
			"Ошибка при определении места. Попробуйте позже"
		);
	});

	it("Обрабатывает клик по метке и переходит к карточке места", async () => {
		mockedUseGetAllPlaces.mockReturnValue({
			places: [{ id: "42", coords: [55.7, 37.6] }],
			isLoading: false,
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await userEvent.click(screen.getByTestId("placemark"));

		expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.PLACE}/42`, {
			state: { backgroundPath: "/" },
		});
	});

	it("Не вызывает геокод если ymaps не загружен", async () => {
		vi.spyOn(reactYMaps, "useYMaps").mockReturnValue(null);

		mockedUseGetAllPlaces.mockReturnValue({
			places: [],
			isLoading: false,
		});

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<YMaps>
						<YandexMap />
					</YMaps>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await userEvent.click(screen.getByTestId("yandex-map"));

		expect(geocodeMock).not.toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
