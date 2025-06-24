import styles from "./place.module.scss";
import { useGetPlaceById } from "../../hooks/useGetPlaceById";
import { RiseLoader } from "react-spinners";
import { useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { useDeletePlace } from "../../hooks/useDeletePlace";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/ROUTES";
import { getFormattedDate } from "./helperGetFormatteDate";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Button from "../../components/Button/Button";
import Gallery from "../../components/Gallery/Gallery";

const Place = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
	const { place, isLoading, error } = useGetPlaceById();
	const { deletePlace } = useDeletePlace();
	const { userUid } = useSelector((state: RootState) => state.auth);
	const isOwner: boolean = place?.user_id === userUid;
	if (isLoading) {
		return <RiseLoader size={8} color="#df7630" data-testid="place-loader" />;
	}

	if (error) {
		return <div>Ошибка загрузки места. Попробуйте позже.</div>;
	}

	if (!place) {
		return <div>Место не найдено</div>;
	}

	const handleDeletePlace = (placeId: string) => {
		deletePlace(placeId);
		navigate(ROUTES.HOME);
	};

	return (
		<div className={styles.place} data-testid="place-page">
			<h2 className={styles.placeTitle}>{place?.place_name}</h2>
			<p className={styles.placeDescription}>
				<span className={styles.placeInfo}>Город:</span>{" "}
				{place.address.location}
			</p>
			{place.description && (
				<p className={styles.placeDescription}>
					<span className={styles.placeInfo}>Заметка:</span>{" "}
					{place?.description}
				</p>
			)}
			{place.trip_start_date && (
				<p>
					<span className={styles.placeInfo}>Даты путешествия:</span>{" "}
					{getFormattedDate(place.trip_start_date)} -{" "}
					{getFormattedDate(place.trip_end_date)}
				</p>
			)}
			<Gallery />
			{isOwner && (
				<div className={styles.placeAction} data-testid="place-аction">
					<Button
						onClick={() =>
							navigate(`${ROUTES.EDIT_PLACE}/${place.id}`, {
								state: {
									backgroundPath: location.pathname,
								},
							})
						}
					>
						Редактировать
					</Button>
					<Button onClick={() => setIsVisibleModal(true)}>Удалить</Button>
				</div>
			)}

			<Modal
				isOpen={isVisibleModal}
				aria-label="Вы хотите удалить"
				onClose={() => setIsVisibleModal(false)}
				title="Подтвердите удаление"
				description="Вы действительно хотите удалить место?"
				isConfirm
				onCloseIsConfirmed={() => handleDeletePlace(place.id)}
			/>
		</div>
	);
};

export default Place;
