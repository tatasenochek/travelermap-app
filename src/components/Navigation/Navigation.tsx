import { useState } from "react";
import Button from "../Button/Button";
import { MapPinHouse, MapPinPlus, Menu, UserRound, X } from "lucide-react";
import styles from "./navigation.module.scss";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../router/ROUTES";
import clsx from "clsx";

const Navigation = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleVisibleModal = () => {
    setIsVisible(!isVisible);
  }
	return (
		<nav className={styles.navigation} aria-label="Основное меню">
			<Button style="icon" onClick={handleVisibleModal}>
				{isVisible ? <Menu /> : <X />}
			</Button>
			<nav hidden={isVisible} className={styles.navigationMenu}>
				<NavLink
					to={ROUTES.HOME}
					aria-label="Главная страница"
					onClick={handleVisibleModal}
					className={({ isActive }) =>
						clsx(
							styles.navigationMenuLink,
							isActive && styles.navigationMenuLinkActive
						)
					}
					end
				>
					<MapPinHouse size={20} />
					Главная страница
				</NavLink>
				<NavLink
					to={ROUTES.ADD_PLACE}
					aria-label="Добавить место"
					onClick={handleVisibleModal}
					className={({ isActive }) =>
						clsx(
							styles.navigationMenuLink,
							isActive && styles.navigationMenuLinkActive
						)
					}
					end
				>
					<MapPinPlus size={20} />
					Добавить место
				</NavLink>
				<NavLink
					to={ROUTES.PERSONAL_ACCOUNT}
					aria-label="Личный кабинет"
					onClick={handleVisibleModal}
					className={({ isActive }) =>
						clsx(
							styles.navigationMenuLink,
							isActive && styles.navigationMenuLinkActive
						)
					}
					end
				>
					<UserRound size={20} />
					Личный кабинет
				</NavLink>
			</nav>
		</nav>
	);
};

export default Navigation;
