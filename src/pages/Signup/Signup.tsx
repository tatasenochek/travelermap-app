import styles from "./signup.module.scss";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import LinkButton from "../../components/LinkButton/LinkButton";
import { ROUTES } from "../../router/ROUTES";
import { useSignup } from "../../hooks/useSignup";

const Signup = () => {
	const { register, errors, onSubmit, isValid, isSubmitting } = useSignup();

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
