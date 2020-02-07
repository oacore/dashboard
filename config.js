export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.core.ac.uk/internal'
    : 'https://api.dev.core.ac.uk/internal'

const ORIGIN = encodeURIComponent(
  typeof window == 'object' ? window.location.origin : ''
)

export const LOGIN_URL =
  process.env.NODE_ENV === 'production'
    ? '/login.html'
    : new URL(`/test/login?continue=${ORIGIN}`, API_URL).toString()
