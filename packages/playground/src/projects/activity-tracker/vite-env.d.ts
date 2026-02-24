/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NCP_KEY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
