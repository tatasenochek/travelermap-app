/// <reference types="vite/client" />
import "@testing-library/jest-dom";

interface ISupabase {
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
}

interface IYandex {
	readonly VITE_API_KEY_YANDEX_MAP: string;
}