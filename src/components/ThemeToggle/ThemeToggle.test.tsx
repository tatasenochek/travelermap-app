/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { beforeEach, describe, expect, it, vi } from "vitest";


describe("Компонент ThemeToggle", () => {
  beforeEach(() => {
		document.documentElement.classList.remove("dark");
		localStorage.clear();
	});

  it("Переключение темной темы", () => {
    	Object.defineProperty(window, "matchMedia", {
				writable: true,
				value: vi.fn().mockImplementation((query: any) => ({
					matches: true,
					media: query,
					onchange: null,
					addListener: vi.fn(),
					removeListener: vi.fn(),
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
					dispatchEvent: vi.fn(),
				})),
			});
		render(<ThemeToggle />);  
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		fireEvent.click(screen.getByRole("button"));
		expect(document.documentElement.classList.contains("dark")).toBe(false);
		fireEvent.click(screen.getByRole("button"));
		expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
  
  it("Переключение стветлой темы", () => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
		render(<ThemeToggle />);

		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});
});
