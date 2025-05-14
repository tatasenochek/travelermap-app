import { useNavigate } from "react-router-dom";
import { SigninSchema, type SigninFormData } from "../utils/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../db/config";
import toast from "react-hot-toast";
import { login } from "../store/slice/authSlice";
import { ROUTES } from "../router/ROUTES";
import { queryClient } from "../store/api/queryClient";

export const useSignin = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm<SigninFormData>({
		resolver: zodResolver(SigninSchema),
		reValidateMode: "onChange",
		mode: "onTouched",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signinMutation = useMutation({
		mutationFn: async (formData: SigninFormData) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password,
			});

			if (error) throw new Error(error.message);
			return data;
		},
		onSuccess: (data) => {
			if (!data?.user) {
				throw new Error("Данные пользователя отсутствуют");
			}

			dispatch(
				login({
					userUid: data.user.id,
					userName: data.user.user_metadata.name,
					isAuth: true,
				})
			);

      queryClient.setQueryData(["auth-session"], data.session);
			queryClient.invalidateQueries({
				queryKey: ["auth-session"],
				refetchType: "active",
			});

			toast.success("Вход выполнен!");
			navigate(ROUTES.HOME);
			form.reset();
		},
		onError: (error: Error) => {
			console.error("Ошибка:", error.message);
			if (error.message.includes("Invalid login")) {
				toast.error("Неверный email или пароль");
			} else {
				toast.error(`Ошибка во время авторизации. Повторите попытку позже`);
			}
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		signinMutation.mutate(data);
	});

	return {
		form,
		register: form.register,
		errors: form.formState.errors,
		isSubmitting: signinMutation.isPending,
		onSubmit,
		isValid: form.formState.isValid,
	};
};
