import toast from "react-hot-toast";
import { supabase } from "../db/config";
import { queryClient } from "../store/api/queryClient";
import { useAuth } from "./useAuth";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
	const { clearSession } = useAuth();

	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.auth.signOut();
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			clearSession();
			queryClient.removeQueries();
			queryClient.invalidateQueries({
				queryKey: ["auth-session"],
				refetchType: "none",
			});
			toast.success("Вы успешно вышли из системы");
		},
		onError: (error: Error) => {
			toast.error(`Ошибка выхода. Повторите попытку позже`);
			console.error("Ошибка:", error.message);
		},
		retry: false,
		retryDelay: 0,
	});
};
