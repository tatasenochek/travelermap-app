import styles from "./form-element.module.scss";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

interface IFormElementProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	name: string;
}

const FormElement = forwardRef<HTMLInputElement, IFormElementProps>(
	({ label, error, name, ...props }, ref) => {
		return (
			<Field className={styles.field}>
				<Label className={styles.fieldLabel} htmlFor={name}>
					{label}
				</Label>
				<Input
					className={clsx(styles.fieldInput, error && styles.fieldInputError)}
					ref={ref}
					name={name}
					id={name}
					aria-invalid={!!error}
					aria-describedby={error ? `${name}-error` : undefined}
					{...props}
				/>
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
