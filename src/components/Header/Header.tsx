import Navigation from "../Navigation/Navigation";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import { ROUTES } from "../../router/ROUTES";
import LinkButton from "../LinkButton/LinkButton";

const Header = () => {
	return (
		<header className={styles.header}>
			<Link to={ROUTES.HOME} className={styles.headerLogo}>
				<img src={logo} alt="Карта путешественника" />
				<h1>
					Карта <br /> путешественника
				</h1>
			</Link>
			<div className={styles.headerAction}>
				<LinkButton to={ROUTES.SIGNUP}>Войти</LinkButton>
				<LinkButton to={ROUTES.PERSONAL_ACCOUNT}>Личный кабинет</LinkButton>
				<Navigation />
			</div>
		</header>
	);
};

export default Header;
