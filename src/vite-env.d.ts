/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_PUBLIC_PATH: string
  readonly VITE_APP_OUT_DIR: string
  readonly VITE_APP_TO_PC: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
