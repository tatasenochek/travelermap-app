import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
	userUid: string | null;
	userName: string | null;
	isAuth: boolean;
}

const initialState: IAuthState = {
	userUid: null,
	userName: null,
	isAuth: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<IAuthState>) => {
			state.userName = action.payload.userName;
			state.userUid = action.payload.userUid;
			state.isAuth = true;
		},
		logout: (state) => {
			state.userName = null;
			state.userUid = null;
			state.isAuth = false;
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
