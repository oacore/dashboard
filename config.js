export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.core.ac.uk/internal'
    : 'https://api.dev.core.ac.uk/internal'

export const getLoginPage = (path = window.location.origin) => {
  if (process.env.NODE_ENV === 'production') {
    return new URL(
      `/login.html?continue=${encodeURIComponent(path)}`,
      window.location.origin
    ).toString()
  }

  return new URL(
    `/test/login?continue=${encodeURIComponent(path)}`,
    API_URL
  ).toString()
}
