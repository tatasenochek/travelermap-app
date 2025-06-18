import styles from "./gallery.module.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useMemo, useState } from "react";
import { supabase } from "../../db/config";
import { X } from "lucide-react";
import { useDeletePhoto } from "../../hooks/useDeletePhoto";
import { useGetPlaceById } from "../../hooks/useGetPlaceById";
import { Modal } from "../Modal/Modal";

const Gallery = () => {
	const [isVisibleModal, setIsVisibleModal] = useState<string | null>(null);
	const { place } = useGetPlaceById();
	const { deletePhoto } = useDeletePhoto();
	const { userUid } = useSelector((state: RootState) => state.auth);
	const isOwner: boolean = useMemo(() => place?.user_id === userUid, [place, userUid]);

	const imagesUrl = place?.photos.map((photo) => ({
		id: photo.id,
		imageUrl: photo.image_path
			? supabase.storage.from("photos").getPublicUrl(photo.image_path).data
					.publicUrl
			: "",
	}));

	if (!imagesUrl?.length) return <div>Нет фотографий</div>;

	const handleDeletePhoto = () => {
		if (isVisibleModal) {
			deletePhoto(isVisibleModal);
			setIsVisibleModal(null);
		}
	};

	return (
		<>
			{userUid ? (
				<div className={styles.galleryWrapper}>
					{imagesUrl?.map(({ id, imageUrl }) => (
						<div key={id} className={styles.galleryPhoto}>
							<img
								src={imageUrl}
								alt={place?.place_name}
								className={styles.galleryPhotoItem}
							/>
							{isOwner && (
								<button
									className={styles.galleryPhotoButton}
									onClick={() => setIsVisibleModal(id)}
								>
									<X size={14} color="white" />
								</button>
							)}
						</div>
					))}
				</div>
			) : (
				<p className={styles.galleryNotAuth}>
					Авторизируйтесь, что бы смотреть фотографии
				</p>
			)}

			<Modal
				isOpen={!!isVisibleModal}
				aria-label="Вы хотите удалить"
				onClose={() => setIsVisibleModal(null)}
				title="Подтвердите удаление"
				description="Вы действительно хотите удалить фото?"
				isConfirm
				onCloseIsConfirmed={handleDeletePhoto}
			/>
		</>
	);
};

export default Gallery;
