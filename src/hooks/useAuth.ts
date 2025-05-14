import { useQuery } from "@tanstack/react-query";
import { supabase } from "../db/config";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/slice/authSlice";
import { useEffect } from "react";
import { queryClient } from "../store/api/queryClient";

export const useAuth = () => {
	const dispatch = useDispatch();

	const { data: session } = useQuery({
		queryKey: ["auth-session"],
		queryFn: async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) throw error;
			return data.session;
		},
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		const { data: authListner } = supabase.auth.onAuthStateChange(
			(event, session) => {
				switch (event) {
					case "SIGNED_IN":
					case "TOKEN_REFRESHED":
					case "USER_UPDATED":
						queryClient.setQueryData(["auth-session"], session?.user ?? null);
						if (session?.user) {
							dispatch(
								login({
									userUid: session.user.id,
									userName: session.user.user_metadata?.name || "",
									isAuth: true,
								})
							);
						}
						break;
					case "SIGNED_OUT":
						queryClient.setQueryData(["auth-session"], null);
						dispatch(logout());
						break;
				}
			}
		);
		return () => authListner.subscription.unsubscribe();
	}, [dispatch]);

	const invalidateSession = () =>
		queryClient.invalidateQueries({ queryKey: ["auth-session"] });

	const clearSession = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			queryClient.removeQueries({ queryKey: ["auth-session"] });
		} catch (error) {
			const err = error as Error;
			console.error("Ошибка:", err.message);
		}
	};

	return {
		session,
		user: session?.user,
		isAuthenticated: !!session?.user,
		invalidateSession,
		clearSession,
	};
};
