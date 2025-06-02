import styles from "./form-element.module.scss";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { Eye, EyeClosed } from "lucide-react";
import Button from "../Button/Button";

interface IFormElementProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	name: string;
}

const FormElement = forwardRef<HTMLInputElement, IFormElementProps>(
	({ label, error, name, type, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword(!showPassword);
		};

		const inputType = type === "password" && showPassword ? "text" : type;

		return (
			<Field className={styles.field}>
				<Label className={styles.fieldLabel} htmlFor={name}>
					{label}
				</Label>
				{type === "password" ? (
					<div
						className={clsx(
							styles.fieldWrapper,
							error && styles.fieldWrapperError
						)}
					>
						<Input
							className={clsx(styles.fieldWrapperPass)}
							ref={ref}
							name={name}
							type={inputType}
							id={name}
							aria-invalid={!!error}
							aria-describedby={error ? `${name}-error` : undefined}
							{...props}
						/>
						<Button
							variant="iconTertiary"
							type="button"
							onClick={togglePasswordVisibility}
							title={showPassword ? "Скрыть пароль" : "Показать пароль"}
							aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
						>
							{showPassword ? <EyeClosed /> : <Eye />}
						</Button>
					</div>
				) : (
					<Input
						className={clsx(styles.fieldInput, error && styles.fieldInputError)}
						ref={ref}
						type={type}
						name={name}
						id={name}
						aria-invalid={!!error}
						aria-describedby={error ? `${name}-error` : undefined}
						{...props}
					/>
				)}
				{error && (
					<span
						id={`${name}-error`}
						className={clsx(styles.fieldError)}
						role="alert"
					>
						{error}
					</span>
				)}
			</Field>
		);
	}
);

export default FormElement;
