import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "../layout/LayoutMain";
import Home from "../pages/Home/Home";
import { ROUTES } from "./ROUTES";
import AddPlace from "../pages/AddPlace/AddPlace";
import Signup from "../pages/Signup/Signup";
import Signin from "../pages/Signin/Signin";
import Place from "../pages/Place/Place";

const router = createBrowserRouter(
	[
		{
			path: ROUTES.HOME,
			element: <LayoutMain />,
			children: [
				{
					index: true,
					element: <Home />,
				},
				{
					path: ROUTES.ADD_PLACE,
					element: <AddPlace />,
				},
				{
					path: ROUTES.SIGNUP,
					element: <Signup />,
				},
				{
					path: ROUTES.SIGNIN,
					element: <Signin />,
				},
				{
					path: ROUTES.PLACE,
					element: <Place />,
				},
				{
					path: ROUTES.PERSONAL_ACCOUNT,
					element: <></>,
				},
			],
		},
	],
	{
		basename: "/travelermap-app",
	}
);

const Router = () => <RouterProvider router={router} />;

export default Router;
