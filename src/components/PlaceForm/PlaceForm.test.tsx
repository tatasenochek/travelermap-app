import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { PlaceFormData, placeSchema } from "../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceForm from "./PlaceForm";

const renderPlaceForm = (onSubmit = jest.fn()) => {
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
		const handleSubmit =
			onSubmit ??
			jest.fn(() => {
				form.formState.isSubmitting = true;
				new Promise((resolve) => setTimeout(resolve, 100));
				form.formState.isSubmitting = false;
			});

		return <PlaceForm form={form} onSubmit={handleSubmit} />;
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
		const handleSubmit = jest.fn();

		renderPlaceForm(handleSubmit);

		fireEvent.input(screen.getByLabelText(/Название путешествия/i), {
			target: { value: "Москва Сити" },
		});
		fireEvent.input(screen.getByLabelText(/Город/i), {
			target: { value: "Москва" },
		});

		fireEvent.submit(screen.getByTestId("place-form"));

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
});
