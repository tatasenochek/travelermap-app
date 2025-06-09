import PlaceForm from "../../components/PlaceForm/PlaceForm";
import { useEditPlace } from "../../hooks/useEditPlace";

const EditPlace = () => {
	const editPlace = useEditPlace();
	if (!editPlace) return;
	const { form, onSubmit } = editPlace;
	return (
		<main>
			<PlaceForm form={form} onSubmit={onSubmit} />
		</main>
	);
};

export default EditPlace;
