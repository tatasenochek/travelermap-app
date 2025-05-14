import Navigation from "../Navigation/Navigation";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import { ROUTES } from "../../router/ROUTES";
import LinkButton from "../LinkButton/LinkButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { LogIn, LogOut, ScanFace } from "lucide-react";
import Button from "../Button/Button";
import { memo } from "react";
import { useLogout } from "../../hooks/useLogout";

const Header = () => {
	const { userName, isAuth } = useSelector((state: RootState) => state.auth);
	const { mutate: logout, isPending } = useLogout();

	const handleLogout = () => {
		const isConfirm = confirm(
			"Вы действительно хотит выйти из личного кабинета?"
		);

		if (!isConfirm) return;

		logout();
	};

	const Logo = memo(() => (
		<Link to={ROUTES.HOME} className={styles.headerLogo}>
			<img src={logo} alt="Карта путешественника" />
			<h1>
				Карта <br /> путешественника
			</h1>
		</Link>
	));

	const UserProfileContent = memo(() => (
		<>
			<ScanFace color="green" size={16} /> {userName}
		</>
	));

	const AuthButtons = memo(() =>
		isAuth ? (
			<Button
				onClick={handleLogout}
				disabled={isPending}
				isLoading={isPending}
				aria-label="Выйти"
			>
				<LogOut size={16} /> Выйти
			</Button>
		) : (
			<LinkButton to={ROUTES.SIGNUP} aria-label="Войти">
				<LogIn size={16} /> Войти
			</LinkButton>
		)
	);

	return (
		<header className={styles.header}>
			<Logo />
			<div className={styles.headerAction}>
				<AuthButtons />
				<LinkButton to={ROUTES.PERSONAL_ACCOUNT}>
					{isAuth ? <UserProfileContent /> : "Личный кабинет"}
				</LinkButton>
				<Navigation />
			</div>
		</header>
	);
};

export default memo(Header);
