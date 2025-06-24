import styles from "./not-found.module.scss";
import Header from "../../components/Header/Header";
import LinkButton from "../../components/LinkButton/LinkButton";
import { ROUTES } from "../../router/ROUTES";

const NotFound = () => {
	return (
		<main>
			<Header />
			<section className={styles.main}>
				<p>Упс.. К сожалению, такой страницы не найдено😔</p>
				<LinkButton to={`${ROUTES.HOME}`}>Перейти на главную</LinkButton>
			</section>
		</main>
	);
};

export default NotFound;
