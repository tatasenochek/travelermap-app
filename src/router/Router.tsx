import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "../layout/LayoutMain";
import Home from "../pages/Home/Home";
import { ROUTES } from "./ROUTES";
import AddPlace from "../pages/AddPlace/AddPlace";
import Signup from "../pages/Signup/Signup";
import Signin from "../pages/Signin/Signin";
import Place from "../pages/Place/Place";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import LayoutModal from "../layout/LayoutModal";

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
					element: (
						<PrivateRoute>
							<LayoutModal title="Место" Component={Home}>
								<AddPlace />
							</LayoutModal>
						</PrivateRoute>
					),
				},
				{
					path: ROUTES.SIGNUP,
					element: (
						<LayoutModal title="Регистрация" Component={Home}>
							<Signup />
						</LayoutModal>
					),
				},  
				{
					path: ROUTES.SIGNIN,
					element: (
						<LayoutModal title="Авторизация" Component={Home}>
							<Signin />
						</LayoutModal>
					),
				},
				{
					path: ROUTES.PLACE,
					element: <Place />,
				},
				{
					path: ROUTES.PERSONAL_ACCOUNT,
					element: (
						<PrivateRoute>
							<main>PERSONAL ACCOUNT</main>
						</PrivateRoute>
					),
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
