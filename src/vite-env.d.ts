/// <reference types="vite/client" />

declare module '@oacore/core-ui/styles';

interface ImportMetaEnv {
    readonly MODE: 'development' | 'production' | 'local'
    readonly VITE_APP_API_BASE_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_API_URL: string
    readonly VITE_IDP_URL: string
    readonly VITE_GITHUB_TOKEN?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
