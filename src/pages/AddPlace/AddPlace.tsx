import styles from "./add-place.module.scss";
import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";
import { useAddPlace } from "../../hooks/useAddPlace";
import FormFile from "../../components/FormFile/FormFile";
import FormTextarea from "../../components/FormTextarea/FormTextarea";
import { useLocation } from "react-router-dom";
import type { LocationState } from "../../utils/types";

const AddPlace = () => {
	const addPlace = useAddPlace();
	const { state } = useLocation();
	const { address } = (state as LocationState) || {};
	if (!addPlace) return null;
	const { form, onSubmit, register, isValid, isSubmitting, errors } = addPlace;

	return (
		<main>
			<Form onSubmit={onSubmit}>
				<FormElement
					label="Название путешествия"
					{...register("place_name")}
					error={errors.place_name?.message}
				/>
				<FormElement
					label="Город"
					{...register("address")}
					value={address.location}
					error={errors.place_name?.message}
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

				<FormFile setValue={form.setValue} errors={errors} name={"photos"} />
				<Button
					disabled={!isValid || isSubmitting}
					isLoading={isSubmitting}
					variant="primary"
				>
					Отправить
				</Button>
			</Form>
		</main>
	);
};

export default AddPlace;
