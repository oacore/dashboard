import { NetworkError } from './errors'

const CORE_API = 'https://api.core.ac.uk/internal'
const CORE_API_DEV = 'https://api.dev.core.ac.uk/internal'

const apiRequest = async (
  url,
  method = 'GET',
  queryParams = {},
  customHeaders = {},
  dev = false
) => {
  try {
    const requestUrl = new URL(
      /^\w+:\/\//.test(url) ? url : `${dev ? CORE_API_DEV : CORE_API}${url}`
    )
    const requestHeaders = {
      Accept: 'application/json',
      ...customHeaders,
    }

    requestUrl.search = new URLSearchParams(queryParams).toString()

    const response = await fetch(requestUrl, {
      method,
      credentials: 'include',
      headers: requestHeaders,
    })

    const { headers } = response
    const type = headers.get('Content-Type')
    const result = { type, headers }

    if (response.status >= 400)
      throw new NetworkError(`Request failed on ${response.status}`, response)

    if (method.toUpperCase() === 'HEAD') return result

    result.data = await (/application\/([\w.-]\+)?json/g.test(type)
      ? response.json()
      : response.blob())

    return result
  } catch (error) {
    const { response, message } = error
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
    networkError.status = (response && response.status) || null
    throw networkError
  }
}

export default apiRequest
