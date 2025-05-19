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
import { memo, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { Modal } from "../Modal/Modal";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Header = () => {
	const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
	const { userName, isAuth } = useSelector((state: RootState) => state.auth);
	const { mutate: logout, isPending } = useLogout();

	const handleLogout = () => {
		logout();
		setIsVisibleModal((prev) => !prev);
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
				onClick={() => setIsVisibleModal((prev) => !prev)}
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
				<ThemeToggle/>
				<Navigation />
			</div>

			<Modal
				isOpen={isVisibleModal}
				aria-label="Подтверждение выхода из личного кабинета"
				onClose={() => setIsVisibleModal((prev) => !prev)}
				title="Подтвердите выход"
				description="Вы действительно хотите выйти из личного кабинета?"
				isConfirm
				onCloseIsConfirmed={handleLogout}
			/>
		</header>
	);
};

export default memo(Header);
