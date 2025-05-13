import { useDispatch } from "react-redux";
import { supabase } from "../db/config";
import { queryClient } from "../store/api/queryClient";
import { logout } from "../store/slice/authSlice";
import toast from "react-hot-toast";

export const useLogout = () => {
	const dispatch = useDispatch();

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			queryClient.clear();
			dispatch(logout());
			toast.success("Выход выполнен");
		} catch (error) {
			const err = error as Error;
			console.error(`Ошибка ${err}`);
			toast.error(`Не удалось выйти. Попробуйте позже`);
		}
	};

	return { handleLogout };
};
