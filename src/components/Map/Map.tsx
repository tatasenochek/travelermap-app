import type { MapEvent } from "yandex-maps";
import { Clusterer, Map, Placemark, useYMaps } from "@pbe/react-yandex-maps";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/ROUTES";
import { PulseLoader } from "react-spinners";
import { useGetAllPlaces } from "../../hooks/useGetAllPlaces";
import type { LocationState } from "../../utils/types";

const YandexMap = () => {
	const ymaps = useYMaps(["geocode"]);
	const navigate = useNavigate();
	const { places, isLoading } = useGetAllPlaces();

	const handleClickOnMap = async (e: MapEvent) => {
		if (!ymaps) return;

		try {
			const coords = e.get("coords") as [number, number];
			const result = await ymaps.geocode(coords);
			const geocodeResult = result.geoObjects.get(0);

			if (!geocodeResult) {
				toast.error("Не удалось определить адрес");
				return;
			}

			navigate(ROUTES.ADD_PLACE, {
				state: {
					coords,
					address: {
						location: String(geocodeResult.properties.get("description", {})),
						route: String(geocodeResult.properties.get("name", {})),
					},
				} as LocationState,
			});
		} catch (error) {
			const err = error instanceof Error;
			console.error("Ошибка геокодирования", err);
			toast("Ошибка при определении места. Попробуйте позже");
		}
	};

	const CENTER = [59.94077030138753, 30.31197058944388];
	const ZOOM = 6;

	if (isLoading) {
		return (
			<PulseLoader
				size={8}
				color="#333"
				aria-label="Спинер загрузки"
				data-testid="loader"
			/>
		);
	}

	return (
		<>
			<Map
				width="100%"
				height="88vh"
				defaultState={{ center: CENTER, zoom: ZOOM }}
				onClick={handleClickOnMap}
			>
				<Clusterer
					options={{
						groupByCoordinates: false,
						clusterDisableClickZoom: true,
					}}
				>
					{places &&
						places.map((place) => (
							<Placemark
								key={place.id}
								geometry={place.coords}
								options={{ preset: "islands#darkOrangeIcon" }}
								onClick={() => navigate(`${ROUTES.PLACE}/${place.id}`)}
							/>
						))}
				</Clusterer>
			</Map>
		</>
	);
};

export default YandexMap;
