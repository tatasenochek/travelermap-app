import { useAddPlace } from "../../hooks/useAddPlace";
import PlaceForm from "../../components/PlaceForm/PlaceForm";

const AddPlace = () => {
	const addPlace = useAddPlace();
	if (!addPlace) return null;
	const { form, onSubmit } = addPlace;

	return (
		<main>
			<PlaceForm form={form} onSubmit={onSubmit} />
		</main>
	);
};

export default AddPlace;
