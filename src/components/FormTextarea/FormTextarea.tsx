import { forwardRef } from "react";
import { Textarea, Field, Label } from "@headlessui/react";
import styles from './form-textarea.module.scss';

interface FormTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	name: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
	({ label, name, ...props }, ref) => {
		return (
			<Field className={styles.field}>
				<Label className={styles.fieldLabel} htmlFor={name}>
					{label}
				</Label>
					<Textarea
						className={styles.fieldTextarea}
						ref={ref}
						name={name}
						id={name}
						{...props}
					/>
			</Field>
		);
	}
);

export default FormTextarea;
