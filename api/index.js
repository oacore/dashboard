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
  const requestUrl = new URL(
    /^\w+:\/\//.test(url) ? url : `${dev ? CORE_API_DEV : CORE_API}${url}`
  )
  const requestHeaders = {
    Accept: 'application/json',
    ...customHeaders,
  }

  requestUrl.search = new URLSearchParams(queryParams).toString()

  const fetchPromise = fetch(requestUrl, {
    method,
    credentials: 'include',
    headers: requestHeaders,
  })
    .then(response => {
      const { headers } = response
      const type = headers.get('Content-Type')
      const result = { type, headers }

      if (response.status >= 400)
        throw new NetworkError(`Request failed on ${response.status}`, response)

      if (method.toUpperCase() === 'HEAD') return result

      const dataPromise = /application\/([\w.-]\+)?json/g.test(type)
        ? response.json()
        : response.blob()

      return new Promise((resolve, reject) =>
        dataPromise.then(
          value =>
            resolve({
              data: value,
              type,
              headers,
            }),
          reason => reject(reason)
        )
      )
    })
    .catch(async error => {
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
    })

  return fetchPromise
}

export default apiRequest
