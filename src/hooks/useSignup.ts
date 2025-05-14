import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SignupSchema, type SignupFormData } from "../utils/types";
import { supabase } from "../db/config";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice";
import { ROUTES } from "../router/ROUTES";
import { queryClient } from "../store/api/queryClient";

export const useSignup = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(SignupSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const signupMutation = useMutation({
		mutationFn: async (formData: SignupFormData) => {
			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					data: {
						name: formData.name,
					},
				},
			});

			if (error) throw new Error(error.message);
			return data;
		},
		onSuccess: (data) => {
			dispatch(
				login({
					userUid: data.user?.id || "",
					userName: data.user?.user_metadata?.name || "",
					isAuth: true,
				})
			);

			queryClient.setQueryData(["auth-session"], data.session);
			queryClient.invalidateQueries({
				queryKey: ["auth-session"],
				refetchType: "active",
			});

			toast.success("Регистрация успешна!");
			navigate(ROUTES.HOME);
			form.reset();
		},
		onError: (error: Error) => {
			console.error(`Ошибка: ${error}`);
			if (error.message.includes("already registered")) {
				toast.error("Этот email уже зарегистрирован");
			} else {
				toast.error("Ошибка регистрации. Повторите попытку позже");
			}
		},
	});

	const onSubmit = form.handleSubmit((data) => signupMutation.mutate(data));

	return {
		form,
		register: form.register,
		errors: form.formState.errors,
		isSubmitting: signupMutation.isPending,
		onSubmit,
		isValid: form.formState.isValid,
	};
};
