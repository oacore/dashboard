type EnvConfig = {
  API_URL: string
  IDP_URL: string
  SENTRY_DSN: string
  GA_TRACKING_CODE: string
  MODE: string
  IS_PRODUCTION: boolean
  IS_DEVELOPMENT: boolean
}

const required: (keyof EnvConfig)[] = ['API_URL', 'IDP_URL',]

const validate = (cfg: Partial<EnvConfig>): void => {
  required.forEach((key) => {
    if (!cfg[key]) {
      throw new Error(`[env] "${key}" is not configured for mode "${import.meta.env.MODE}".`)
    }
  })
}

export const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL ?? '',
  IDP_URL: import.meta.env.VITE_IDP_URL ?? '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN ?? '',
  GA_TRACKING_CODE: import.meta.env.VITE_GA_TRACKING_CODE ?? '',
  MODE: import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
}

validate(env)
