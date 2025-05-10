import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import styles from "./button.module.scss";
import { PulseLoader } from "react-spinners";

const override: CSSProperties = {
	display: "block",
	// marginTop: "5px",
};

type ButtonStyles = "primary" | "secondary" | "icon";

interface IButtonProps {
	children: ReactNode;
	style?: ButtonStyles;
	isLoading?: boolean;
	title?: string;
	disabled?: boolean;
	onClick?: () => void;
}

const Button = ({
	children,
	style = "primary",
	isLoading = false,
	disabled = false,
	title = "",
	onClick,
	...props
}: IButtonProps) => {
	return (
		<button
			title={title}
			className={clsx(styles.button, styles[`${style}`])}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			onClick={onClick}
			{...props}
		>
			{isLoading ? (
				<PulseLoader
					size={8}
					color="#333"
					aria-label="Спинер загрузки"
					data-testid="loader"
					cssOverride={override}
				/>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
