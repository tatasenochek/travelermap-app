import { lazy } from "react";

export const Signin = lazy(() => import("../pages/Signup/Signup"));
export const Signup = lazy(() => import("../pages/Signup/Signup"));
export const AddPlace = lazy(() => import("../pages/AddPlace/AddPlace"));
export const Place = lazy(() => import("../pages/Place/Place"));
export const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
export const EditPlace = lazy(() => import("../pages/EditPlace/EditPlace"));
export const PersonalAccount = lazy(() => import("../pages/PersonalAccount/PersonalAccount"));
