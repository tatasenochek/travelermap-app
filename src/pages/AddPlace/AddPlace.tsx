import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";
import { useAddPlace } from "../../hooks/useAddPlace";
import FormFile from "../../components/FormFile/FormFile";
import FormTextarea from "../../components/FormTextarea/FormTextarea";

const AddPlace = () => {
	const addPlace = useAddPlace();
	if (!addPlace) return null;
	const { form, onSubmit, register, isValid, isSubmitting, errors } = addPlace;

	return (
		<main>
			<Form onSubmit={onSubmit}>
				<FormElement
					label="Название"
					{...register("place_name")}
					error={errors.place_name?.message}
				/>
				<FormTextarea
					label="Описание"
					{...register("description")}
				/>
				<FormFile setValue={form.setValue} errors={errors} name={"image"} />
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
