export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.core.ac.uk/internal'
    : 'https://api.dev.core.ac.uk/internal'

export const getLoginPage = (path = window.location.origin) =>
  new URL(
    `/test/login?continue=${encodeURIComponent(path)}`,
    process.env.NODE_ENV === 'production' ? undefined : API_URL
  ).toString()
