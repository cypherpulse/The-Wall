// Contribution #69: "^1.8.14", - Database migrations
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
