/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAS_URL?: string;
  readonly VITE_USE_REAL_GAS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
