import styles from "./place.module.scss";
import { useGetPlaceById } from "../../hooks/useGetPlaceById";
import { RiseLoader } from "react-spinners";
import { useGetImageUrl } from "../../hooks/useGetImageUrl";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Place = () => {
	const { place, isLoading, error } = useGetPlaceById();
	const { imageUrl } = useGetImageUrl(place?.image_path);
	const { userUid } = useSelector((state: RootState) => state.auth);


	if (isLoading) {
		return <RiseLoader size={8} color="#df7630" />;
	}

	if (error) {
		return <div>Ошибка загрузки места. Попробуйте позже.</div>;
	}

	if (!place) {
		return <div>Место не найдено</div>;
	}

	return (
		<div className={styles.place}>
			<h2 className={styles.placeTitle}>{place?.place_name}</h2>
			<p className={styles.placeDescription}>{place?.description}</p>
			{userUid ? (
				<img
					src={imageUrl}
					alt={place.place_name}
					className={styles.placeImage}
				/>
			) : (
				<p className={styles.placeNotAuth}>
					Авторизируйтесь, что бы смотреть фотографии
				</p>
			)}
		</div>
	);
};

export default Place;
