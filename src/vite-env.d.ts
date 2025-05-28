/// <reference types="vite/client" />

interface ViteTypeOptions {
}

interface ImportMetaEnv {
  readonly VITE_APP_PROXY_SCHEME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}