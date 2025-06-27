import PlaceForm from "../../components/PlaceForm/PlaceForm";
import { useAddPlace } from "../../features/places/hooks/useAddPlace";

const AddPlace = () => {
	const { form, onSubmit } = useAddPlace();

	return (
		<main>
			<PlaceForm form={form} onSubmit={onSubmit} />
		</main>
	);
};

export default AddPlace;
