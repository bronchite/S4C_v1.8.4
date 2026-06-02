/// <reference types="vite/client" />

// Déclarations de modules non-TypeScript (CSS, images…)
declare module '*.css';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly BASE_URL: string;   // injecté par Vite (base dans vite.config)
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
