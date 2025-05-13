import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.scss";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../store/api/queryClient";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={ErrorPage}>
			<QueryClientProvider client={queryClient}>
				<App />
				<Toaster/>
			</QueryClientProvider>
		</ErrorBoundary>
	</StrictMode>
);
