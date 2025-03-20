/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENV: "local" | "prod";
    // Add other environment variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
