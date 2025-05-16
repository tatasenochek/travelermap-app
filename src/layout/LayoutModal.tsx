import { Outlet, useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";

const LayoutModal = ({ title }: { title: string }) => {
	const navigate = useNavigate();

	const handleClose = () => {
		navigate(-1);
	};

	return (
		<Modal onClose={handleClose} isOpen={true} title={title} isConfirm={false}>
			<Outlet />
		</Modal>
	);
};

export default LayoutModal;
