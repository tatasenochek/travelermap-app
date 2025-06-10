import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "../layout/LayoutMain";
import Home from "../pages/Home/Home";
import { ROUTES } from "./ROUTES";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import LayoutModal from "../layout/LayoutModal";
import {
	AddPlace,
	EditPlace,
	NotFound,
	PersonalAccount,
	Place,
	Signin,
	Signup,
} from "./LAZY";

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
					path: `${ROUTES.EDIT_PLACE}/:id`,
					element: (
						<PrivateRoute>
							<LayoutModal title="Редактировать место" Component={Home}>
								<EditPlace />
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
						<LayoutModal title="Вход" Component={Home}>
							<Signin />
						</LayoutModal>
					),
				},
				{
					path: `${ROUTES.PLACE}/:id`,
					element: (
						<LayoutModal title="Подробнее" Component={Home}>
							<Place />
						</LayoutModal>
					),
				},
				{
					path: ROUTES.PERSONAL_ACCOUNT,
					element: (
						<PrivateRoute>
							<PersonalAccount />
						</PrivateRoute>
					),
				},
			],
		},
		{
			path: "*",
			element: <NotFound/>
		}
	],
	{
		basename: "/travelermap-app",
	}
);

const Router = () => <RouterProvider router={router} />;

export default Router;
