import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./link-button.module.scss";

interface ILinkButtonProps {
	to: string;
	children: ReactNode;
}

const LinkButton = ({ to, children }: ILinkButtonProps) => {
	return <Link to={to} className={styles.link}>{children}</Link>;
};

export default LinkButton;
