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
import { Suspense } from "react";
import { PulseLoader } from "react-spinners";

const Loader = (
	<PulseLoader
		size={8}
		color="#333"
		aria-label="Спинер загрузки"
		data-testid="loader"
	/>
);

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
							<Suspense fallback={Loader}>
								<LayoutModal title="Место" Component={Home}>
									<AddPlace />
								</LayoutModal>
							</Suspense>
						</PrivateRoute>
					),
				},
				{
					path: `${ROUTES.EDIT_PLACE}/:id`,
					element: (
						<PrivateRoute>
							<Suspense fallback={Loader}>
								<LayoutModal title="Редактировать место" Component={Home}>
									<EditPlace />
								</LayoutModal>
							</Suspense>
						</PrivateRoute>
					),
				},
				{
					path: ROUTES.SIGNUP,
					element: (
						<Suspense fallback={Loader}>
							<LayoutModal
								title="Регистрация"
								Component={Home}
								backgroundPath={ROUTES.HOME}
							>
								<Signup />
							</LayoutModal>
						</Suspense>
					),
				},
				{
					path: ROUTES.SIGNIN,
					element: (
						<Suspense fallback={Loader}>
							<LayoutModal
								title="Вход"
								Component={Home}
								backgroundPath={ROUTES.HOME}
							>
								<Signin />
							</LayoutModal>
						</Suspense>
					),
				},
				{
					path: `${ROUTES.PLACE}/:id`,
					element: (
						<Suspense fallback={Loader}>
							<LayoutModal
								title="Подробнее"
								Component={Home}
								backgroundPath={ROUTES.HOME}
							>
								<Place />
							</LayoutModal>
						</Suspense>
					),
				},
				{
					path: ROUTES.PERSONAL_ACCOUNT,
					element: (
						<Suspense fallback={Loader}>
							<PrivateRoute>
								<PersonalAccount />
							</PrivateRoute>
						</Suspense>
					),
				},
			],
		},
		{
			path: "*",
			element: (
				<Suspense fallback={Loader}>
					<NotFound />
				</Suspense>
			),
		},
	],
	{
		basename: "/travelermap-app",
	}
);

const Router = () => <RouterProvider router={router} />;

export default Router;
