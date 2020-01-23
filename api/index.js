import { NetworkError } from './errors'

const CORE_API = 'https://api.core.ac.uk/internal'
const CORE_API_DEV = 'https://api.dev.core.ac.uk/internal'

const apiRequest = async (
  url,
  method = 'GET',
  params = {},
  customHeaders = {},
  dev = false
) => {
  try {
    let finalURL = `${dev ? CORE_API_DEV : CORE_API}${url}`
    if (url.startsWith('http')) finalURL = url
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }
    const response = await fetch(finalURL, {
      method,
      params,
      credentials: 'include',
      headers,
    })

    if (response.status === 401) window.location.replace('/login.html')
    if (response.status >= 400)
      throw new NetworkError(`Request failed on ${response.status}`, response)

    if (headers['Content-Type'] === 'application/json') {
      return {
        headers: response.headers,
        data: await response.json(),
      }
    }

    return {
      headers: response.headers,
      data: await response.blob(),
    }
  } catch (e) {
    const { response, message } = e
    const { text } = await response.text()
    let networkError
    if (response) {
      networkError = new NetworkError(
        `Request for ${method} ${url} failed. Response: ${response.status}, ${text}`
      )
    } else if (message === 'Network Error') {
      networkError = new NetworkError(
        `Request ${method} ${url} failed. You are probably in offline mode.`
      )
    } else {
      networkError = new NetworkError(
        `Request ${method} ${url} failed. The original error was: ${message}`
      )
    }
    networkError.status = (response && response.status) || 500
    throw networkError
  }
}

export default apiRequest
