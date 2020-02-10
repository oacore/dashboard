export const API_URL = 'https://api.dev.core.ac.uk/internal'

const ORIGIN = encodeURIComponent(
  typeof window == 'object' ? window.location.origin : ''
)

export const LOGIN_URL = new URL(
  `/test/login?continue=${ORIGIN}`,
  API_URL
).toString()
