import styles from "./place-form.module.scss";
import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";
import FormFile from "../../components/FormFile/FormFile";
import FormTextarea from "../../components/FormTextarea/FormTextarea";
import type { UseFormReturn } from "react-hook-form";
import type { PlaceFormData } from "../../utils/types";

interface IPlaceFormProps {
	form: UseFormReturn<PlaceFormData>;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const PlaceForm = ({ onSubmit, form }: IPlaceFormProps) => {
  const {
		register,
		formState: { errors, isSubmitting, isValid },
  } = form;
  
	return (
		<Form onSubmit={onSubmit}>
			<FormElement
				label="Название путешествия"
				{...register("place_name")}
				error={errors.place_name?.message}
			/>
			<FormElement
				label="Город"
				{...register("address")}
				error={errors.address?.message}
			/>
			<FormTextarea
				label="Заметки и впечатления"
				{...register("description")}
			/>
			<div className={styles.wrapper}>
				<FormElement
					type="date"
					label="Дата начала поездки"
					{...register("trip_start_date")}
					error={errors.trip_start_date?.message}
				/>
				<FormElement
					type="date"
					label="Дата окончания поездки"
					{...register("trip_end_date")}
					error={errors.trip_end_date?.message}
				/>
			</div>

			<FormFile
				setValue={form.setValue}
				errors={errors}
				name={"photos"}
			/>
			<Button
				disabled={!isValid || isSubmitting}
				isLoading={isSubmitting}
				variant="primary"
			>
				Отправить
			</Button>
		</Form>
	);
};

export default PlaceForm;
