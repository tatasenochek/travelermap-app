import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "istanbul",
			reporter: ["text", "json", "html"],
			exclude: [
				"src/app/main.tsx",
				"src/utils/**",
				"src/db/**",
				"src/router/**",
				"src/store/store.ts",
				"types.ts",
			],
		},
	},
});
