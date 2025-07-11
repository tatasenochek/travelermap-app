import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.scss";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../store/api/queryClient";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { YMaps } from "@pbe/react-yandex-maps";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { yandexApiKey } from "../utils/config";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("'root' элемент не найден");

createRoot(rootElement).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={ErrorPage}>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<YMaps
						query={{
							apikey: yandexApiKey,
							lang: "ru_RU",
							load: "package.full",
							ns: "myCustomNS",
						}}
					>
						<App />
						<Toaster />
					</YMaps>
				</QueryClientProvider>
			</Provider>
		</ErrorBoundary>
	</StrictMode>
);
