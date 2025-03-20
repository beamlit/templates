import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), "VITE_");

    console.log(`Running in ${mode} mode with ENV=${env.VITE_ENV}`);

    return {
        plugins: [react()],
        build: {
            outDir: "../backend/static",
            emptyOutDir: true,
            sourcemap: true
        },
        resolve: {
            preserveSymlinks: true,
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        server: {
            proxy: {
                "/realtime": {
                    target: "ws://localhost:8765",
                    ws: true,
                    rewriteWsOrigin: true
                }
            }
        }
    };
});
