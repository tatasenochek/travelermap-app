import { MapPinHouse, MapPinPlus, MenuIcon, UserRound } from "lucide-react";
import styles from "./navigation.module.scss";
import { Link } from "react-router-dom";
import { ROUTES } from "../../router/ROUTES";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Navigation = () => {
	return (
		<Menu as="nav" aria-label="Основное меню">
			<MenuButton className={styles.menuContainer}>
				<MenuIcon />
			</MenuButton>
			<MenuItems className={styles.menuItems}>
				<MenuItem
					as={Link}
					to={ROUTES.HOME}
					aria-label="Главная страница"
					className={styles.menuItem}
				>
					<MapPinHouse size={20} />
					Главная страница
				</MenuItem>
				<MenuItem
					as={Link}
					to={ROUTES.ADD_PLACE}
					aria-label="Добавить место"
					className={styles.menuItem}
				>
					<MapPinPlus size={20} />
					Добавить место
				</MenuItem>
				<MenuItem
					as={Link}
					to={ROUTES.PERSONAL_ACCOUNT}
					aria-label="Личный кабинет"
					className={styles.menuItem}
				>
					<UserRound size={20} />
					Личный кабинет
				</MenuItem>
			</MenuItems>
		</Menu>
	);
};

export default Navigation;
