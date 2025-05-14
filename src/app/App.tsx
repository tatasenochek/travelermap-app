import { useAuth } from "../hooks/useAuth";
import Router from "../router/Router";

function App() {
	useAuth();

	return <Router />;
}

export default App;
