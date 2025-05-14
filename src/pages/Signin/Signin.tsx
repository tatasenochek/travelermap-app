import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import FormElement from "../../components/FormElement/FormElement";
import LinkButton from "../../components/LinkButton/LinkButton";
import { ROUTES } from "../../router/ROUTES";
import styles from "./signin.module.scss";
import { useSignin } from "../../hooks/useSignin";

const Signin = () => {
	const { register, onSubmit, errors, isValid, isSubmitting } = useSignin();

	return (
		<main className={styles.signin}>
			<Form onSubmit={onSubmit}>
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
				{/* <Button>Забвыли пароль</Button> */}
				<Button
					disabled={!isValid || isSubmitting}
					isLoading={isSubmitting}
					style="primary"
				>
					Отправить
				</Button>
			</Form>
			<div className={styles.signinAction}>
				<span className={styles.signinActionText}>Нет акканута?</span>
				<LinkButton style="secondary" to={`${ROUTES.SIGNUP}`}>
					Регистрация
				</LinkButton>
			</div>
		</main>
	);
};

export default Signin;
