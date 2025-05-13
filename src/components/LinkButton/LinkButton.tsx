import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./link-button.module.scss";
import clsx from "clsx";

type LinkStyles = "primary" | "secondary";

interface ILinkButtonProps {
	to: string;
	children: ReactNode;
	style?: LinkStyles;
}

const LinkButton = ({ to, children, style = "primary" }: ILinkButtonProps) => {
	return (
		<Link to={to} className={clsx(styles.link, styles[`${style}`])}>
			{children}
		</Link>
	);
};

export default LinkButton;
