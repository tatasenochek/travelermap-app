import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"\\.(css|scss|sass)$": "identity-obj-proxy",
	},
	testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
};

export default config;
