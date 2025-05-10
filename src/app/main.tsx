import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.scss";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={ErrorPage}>
			<App />
		</ErrorBoundary>
	</StrictMode>
);
