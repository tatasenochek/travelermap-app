import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "../layout/LayoutMain";
import Home from "../pages/Home/Home";
import { ROUTES } from "./ROUTES";
import AddPlace from "../pages/AddPlace/AddPlace";

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
					element: <AddPlace/>
				},
				{
					path: ROUTES.PERSONAL_ACCOUNT,
					element:<></>
				}
			],
		},
	],
	{
		basename: "/travelermap-app",
	}
);

const Router = () => <RouterProvider router={router}/>

export default Router