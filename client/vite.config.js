import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load all env vars (empty prefix = include non-VITE_ vars too)
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                "/api": {
                    target: env.API_URL ?? "http://localhost:5000",
                    changeOrigin: true
                }
            }
        }
    };
});
