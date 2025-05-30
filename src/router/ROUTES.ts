export const ROUTES = {
	HOME: "/",
  ADD_PLACE: "/add-place",
  PERSONAL_ACCOUNT: "/personal-account",
	SIGNIN: "/signin",
	SIGNUP: "/signup",
	PLACE: "/book/:id",
	NOT_FOUND: "/*",
} as const;

export type RoutePaths = (typeof ROUTES)[keyof typeof ROUTES];
