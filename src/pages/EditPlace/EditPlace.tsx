import toast from "react-hot-toast";
import PlaceForm from "../../components/PlaceForm/PlaceForm";
import { useEditPlace } from "../../features/places/hooks/useEditPlace";

const EditPlace = () => {
	const editPlace = useEditPlace();
	if (!editPlace) {
		toast.error("Не удалось загрузить данные места");
		return null;
	}

	const { form, onSubmit } = editPlace;
	
	return (
		<main>
			<PlaceForm form={form} onSubmit={onSubmit} />
		</main>
	);
};

export default EditPlace;
