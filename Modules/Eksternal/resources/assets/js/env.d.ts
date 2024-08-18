/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RECAPTCHA_SITE_KEY: string
  // define another env as you define on .env file
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
