export const ROUTES = {
	HOME: "/",
	ADD_PLACE: "/add-place",
	EDIT_PLACE: "/edit-place",
	PERSONAL_ACCOUNT: "/personal-account",
	SIGNIN: "/signin",
	SIGNUP: "/signup",
	PLACE: "/place",
	NOT_FOUND: "/*",
} as const;

export type RoutePaths = (typeof ROUTES)[keyof typeof ROUTES];
