import styles from "./signup.module.scss";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import LinkButton from "../../components/LinkButton/LinkButton";
import { ROUTES } from "../../router/ROUTES";
import { useForm } from "react-hook-form";
import { SignupSchema, type SignupFormData } from "../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../db/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(SignupSchema),
		mode: "all",
		reValidateMode: "onChange",
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

			if (error) {
				console.error("Полная ошибка:", {
					status: error.status, // 400?
					message: error.message, // "Email already registered"
					details: error, // Весь объект ошибки
				});
			}
			return data;
		},
		// onError: (error: any) => {
		// 	setError("root", {
		// 		type: "manual",
		// 		message: error.message || "Ошибка регистрации",
		// 	});
		// },
		onSuccess: () => {
			// Редирект или показ успешного сообщения
			toast.success("Регистрация успешна!");
			navigate(ROUTES.HOME)
		},
	});

	const onSubmit = handleSubmit((data) => {
		signupMutation.mutate(data);
	});

	return (
		<main className={styles.signup}>
			<Form onSubmit={onSubmit}>
				<FormElement
					label="Имя пользователя"
					error={errors.name?.message}
					autoFocus
					{...register("name")}
				/>
				<FormElement
					label="Электронная почта"
					{...register("email")}
					error={errors.email?.message}
				/>
				<FormElement
					label="Пароль"
					type="password"
					{...register("password")}
					error={errors.password?.message}
				/>
				<Button
					disabled={!isValid || isSubmitting}
					isLoading={isSubmitting}
					style="primary"
				>
					Отправить
				</Button>
			</Form>
			<div className={styles.signupAction}>
				<span className={styles.signupActionText}>Есть акканут?</span>
				<LinkButton style="secondary" to={`${ROUTES.SIGNIN}`}>
					Войти
				</LinkButton>
			</div>
		</main>
	);
};

export default Signup;
