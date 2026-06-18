/// <reference types="vite/client" />

interface Window {
    snap: {
        pay: (token: string, options?: any) => void;
    };
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
