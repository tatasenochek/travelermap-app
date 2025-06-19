import type { FormHTMLAttributes, ReactNode } from "react";
import styles from "./form.module.scss";
import clsx from "clsx";

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {
	children: ReactNode;
	isLoading?: boolean;
	formRef?: React.Ref<HTMLFormElement>;
}

const Form = ({ formRef, children, isLoading, ...props }: IFormProps) => {
	return (
		<form
			ref={formRef}
			className={clsx(styles.form, isLoading && styles.formLoading)}
			data-testid="place-form"
			{...props}
		>
			{children}
		</form>
	);
};

export default Form;
