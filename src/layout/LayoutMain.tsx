import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

const LayoutMain = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default LayoutMain;
