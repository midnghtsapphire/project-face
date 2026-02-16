/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_BRAND_NAME: string;
  readonly VITE_BRAND_PARENT: string;
  readonly VITE_HUB_URL: string;
  readonly VITE_OFFICIAL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
