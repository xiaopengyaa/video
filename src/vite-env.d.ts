/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_PUBLIC_PATH: string
  readonly VITE_APP_SHOW_VCONSOLE: string
  readonly VITE_APP_TO_PC: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
