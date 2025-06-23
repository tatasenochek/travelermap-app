/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { PlaceFormData, placeSchema } from "../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceForm from "./PlaceForm";
import styles from "../Form/form.module.scss";
import { describe, expect, it, vi } from "vitest";


const renderPlaceForm = (onSubmit = vi.fn()) => {
	const Wrapper = () => {
		const form = useForm<PlaceFormData>({
			resolver: zodResolver(placeSchema),
			reValidateMode: "onChange",
			mode: "onTouched",
			defaultValues: {
				place_name: "",
				description: "",
				address: "",
				trip_start_date: "",
				trip_end_date: "",
				photos: [],
			},
		});

		const { handleSubmit } = form;
		const handleFormSubmit = handleSubmit(onSubmit);

		return <PlaceForm form={form} onSubmit={handleFormSubmit} />;
	};
	render(<Wrapper />);
};

describe("компонент формы PlaceForm", () => {
	it("Рендер всех полей формы", () => {
		renderPlaceForm();
		expect(screen.getByLabelText(/Название путешествия/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Город/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Заметки и впечатления/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Дата начала поездки/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/Дата окончания поездки/i)
		).toBeInTheDocument();
		expect(screen.getByText(/Фото места/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Отправить/i })
		).toBeInTheDocument();
	});
	it("Состояние disabled, если форма не валидна", () => {
		renderPlaceForm();
		expect(screen.getByRole("button")).toBeDisabled();
	});
	it("Состояние active, если форма валидна", async () => {
		renderPlaceForm();
		fireEvent.input(screen.getByLabelText(/Название путешествия/i), {
			target: { value: "Москва Сити" },
		});
		fireEvent.input(screen.getByLabelText(/Город/i), {
			target: { value: "Москва" },
		});
		await waitFor(() => {
			expect(screen.getByRole("button")).not.toBeDisabled();
		});
	});
	it("Отправка формы", async () => {
		const handleSubmit = vi.fn(() => {
			return new Promise((resolve) => setTimeout(resolve, 100));
		});

		renderPlaceForm(handleSubmit);

		fireEvent.input(screen.getByLabelText(/Название путешествия/i), {
			target: { value: "Москва Сити" },
		});
		fireEvent.input(screen.getByLabelText(/Город/i), {
			target: { value: "Москва" },
		});

		const form = screen.getByTestId("place-form");
		fireEvent.submit(form);

		await waitFor(() => {
			expect(form).toHaveClass(styles.formLoading);
		});

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
	it("Не должен добавлять класс loading при isSubmitting=false", () => {
		renderPlaceForm();

		const form = screen.getByTestId("place-form");
		expect(form).not.toHaveClass(styles.formLoading);
	});
	it("Валидирование поля 'Название путешествия'", async () => {
		renderPlaceForm();
		fireEvent.input(screen.getByLabelText(/Название путешествия/i), {
			target: { value: "М" },
		});
		fireEvent.blur(screen.getByLabelText(/Название путешествия/i));
		await waitFor(() => {
			expect(
				screen.getByText("Название должно содержать минимум 2 символа")
			).toBeInTheDocument();
		});
	});
	it("Валидирование поля 'Город'", async () => {
		renderPlaceForm();
		fireEvent.input(screen.getByLabelText(/Город/i), {
			target: { value: "М" },
		});
		fireEvent.blur(screen.getByLabelText(/Город/i));
		await waitFor(() => {
			expect(
				screen.getByText("Название должно содержать минимум 2 символа")
			).toBeInTheDocument();
		});
	});
});
