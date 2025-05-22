import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";
import { ROUTES } from "../router/ROUTES";
import type { ComponentType, ReactNode } from "react";

const LayoutModal = ({
	title,
	Component,
	children,
}: {
	title: string;
	children: ReactNode;
	Component: ComponentType;
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const backgroundPath = location.state?.backgroundPath || ROUTES.HOME;

	const handleClose = () => {
		navigate(backgroundPath, { replace: true });
	};

	return (
		<>
			<Component />
			<Modal
				onClose={handleClose}
				isOpen={true}
				title={title}
				isConfirm={false}
			>
				{children}
			</Modal>
		</>
	);
};

export default LayoutModal;
