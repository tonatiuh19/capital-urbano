/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Production site origin for canonical URLs and Open Graph (no trailing slash). */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

