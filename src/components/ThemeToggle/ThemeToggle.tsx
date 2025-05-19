import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState<boolean>(false);

	const toggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		localStorage.setItem(
			"theme",
			document.documentElement.classList.contains("dark") ? "dark" : "light"
		);
		setIsDark(!isDark);
	};

	useEffect(() => {
		const savedTheme =
			localStorage.getItem("theme") ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light");
		if (savedTheme === "dark") {
			document.documentElement.classList.add("dark");
		}
	}, []);

	return (
		<Button
			onClick={toggleTheme}
			variant="iconSecondary"
		>
      { isDark ? <MoonIcon/> : <SunIcon/>}
		</Button>
	);
};

export default ThemeToggle;
