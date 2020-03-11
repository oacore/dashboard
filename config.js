export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.core.ac.uk/internal'
    : 'https://api.dev.core.ac.uk/internal'

export const getLoginPage = (fullPath = false) =>
  new URL(
    `/test/login?continue=${
      fullPath ? window.location.href : window.location.origin
    }`,
    process.env.NODE_ENV === 'production' ? undefined : API_URL
  ).toString()
