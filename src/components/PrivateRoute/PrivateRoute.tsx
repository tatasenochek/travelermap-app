import { Navigate } from "react-router-dom";
import { ROUTES } from "../../router/ROUTES";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
	const { userUid } = useSelector((state: RootState) => state.auth);

	return userUid ? (
		children
	) : (
		<Navigate
			to={`${ROUTES.SIGNIN}`}
			replace
		/>
	);
};

export default PrivateRoute;
