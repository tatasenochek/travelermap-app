import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";
import type { ComponentType, ReactNode } from "react";
import { ROUTES } from "../router/ROUTES";

const LayoutModal = ({
	title,
	Component,
	children,
	backgroundPath,
}: {
	title: string;
	children: ReactNode;
	Component: ComponentType;
	backgroundPath?: string;
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const background =
		backgroundPath || location.state?.backgroundPath || ROUTES.HOME;

	const handleClose = () => {
		navigate(background, { replace: true });
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
