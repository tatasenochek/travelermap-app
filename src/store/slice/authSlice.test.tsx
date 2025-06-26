import { describe, expect, it } from "vitest";
import authReducer, { login, logout } from "./authSlice";

describe("authSlice", () => {
	const initialState = {
		userUid: null,
		userName: null,
		isAuth: false,
	};

	it("должен вернуть начальное состояние", () => {
		expect(authReducer(undefined, { type: "" })).toEqual(initialState);
	});

	it("должен установить пользователя при login", () => {
		const payload = {
			userUid: "123",
			userName: "Tata",
			isAuth: false,
		};

		const state = authReducer(initialState, login(payload));

		expect(state).toEqual({
			userUid: "123",
			userName: "Tata",
			isAuth: true,
		});
	});

	it("должен сбросить пользователя при logout", () => {
		const loggedInState = {
			userUid: "123",
			userName: "Tata",
			isAuth: true,
		};

		const state = authReducer(loggedInState, logout());

		expect(state).toEqual(initialState);
	});
});
