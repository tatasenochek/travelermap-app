import styles from "./form-file.module.scss";
import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondFile } from "filepond";
import type {
	UseFormSetValue,
	FieldErrors,
	FieldValues,
	Path,
	PathValue,
} from "react-hook-form";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginImageResize,
	FilePondPluginImageTransform
);

interface FormFileProps<T extends FieldValues> {
	setValue: UseFormSetValue<T>;
	errors: FieldErrors<T>;
	name: Path<T>;
	label?: string;
}

const FormFile = <T extends FieldValues>({
	setValue,
	errors,
	name,
	label = "Фото места (максимум 5)",
}: FormFileProps<T>) => {
	const handleUpdateFiles = (files: FilePondFile[]) => {
		const fileList = files.map((item) => item.file);
		setValue(name, fileList as PathValue<T, Path<T>>, { shouldValidate: true });
	};

	return (
		<div className={styles.file}>
			<label className={styles.fileLabel}>{label}</label>
			<FilePond
				name={name as string}
				onupdatefiles={handleUpdateFiles}
				acceptedFileTypes={["image/*"]}
				maxFiles={5}
				allowMultiple={true}
				labelIdle='Перетащите фото или <span class="filepond--label-action">выберите файл</span>'
				allowProcess={false}
				instantUpload={false}
				labelFileWaitingForSize="Ожидание"
				labelFileSizeNotAvailable="Размер недоступен"
				labelFileLoading="Загрузка"
				labelFileLoadError="Ошибка загрузки"
				labelFileProcessing="Загрузка"
				labelFileProcessingComplete="Загружено"
				labelFileProcessingAborted="Отменено"
				labelFileProcessingError="Ошибка загрузки"
				allowImageTransform={true}
				imageResizeTargetWidth={1024}
				imageResizeTargetHeight={768}
				imageResizeMode="contain"
				imageTransformOutputQuality={80}
				imageTransformOutputStripImageHead={true}
				imageTransformOutputMimeType="image/webp"
			/>
			{errors[name] && (
				<p className={styles.fileError}>{errors[name]?.message as string}</p>
			)}
		</div>
	);
};

export default FormFile;
