import styles from "./personal-account.module.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useGetAllPlaces } from "../../hooks/useGetAllPlaces";
import { getFormattedDate } from "../Place/helperGetFormatteDate";

const PersonalAccount = () => {
	const { userName, userUid } = useSelector((state: RootState) => state.auth);
	const { places } = useGetAllPlaces();
	if (!places) return;
	if (!userUid) return;
	const travelers = places.filter((t) => t.user_id === userUid);

	return (
		<main className={styles.personal}>
			<h1 className={styles.personalTitle}>
				Информация о путешествиях <br />
				пользователя {userName}
			</h1>
			<p className={styles.personalDescription}>
				Количество путешествий: {travelers.length}
			</p>
			<ul className={styles.personalList}>
				{travelers.map((travel) => (
					<li className={styles.personalItem} key={travel.id}>
						<p className={styles.personalItemText}>
							<span>Дата путешествия:</span>{" "}
							{getFormattedDate(travel.dateStart)} -{" "}
							{getFormattedDate(travel.dateEnd)}
						</p>
						<p className={styles.personalItemText}>
							<span>Название:</span> {travel.title}
						</p>
					</li>
				))}
			</ul>
		</main>
	);
};

export default PersonalAccount;
