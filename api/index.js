import { NetworkError } from './errors'
import { API_URL } from '../config'

import { CancelablePromise } from 'utils/promise'

const apiRequest = (
  url,
  method = 'GET',
  queryParams = {},
  customHeaders = {},
  data
) => {
  // Initialise URL
  const requestUrl = new URL(/^\w+:\/\//.test(url) ? url : `${API_URL}${url}`)
  requestUrl.search = new URLSearchParams(queryParams).toString()

  // Initialise options
  const requestOptions = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  }

  // Process body
  if (!['GET', 'HEAD'].includes(method.toUpperCase())) {
    if (typeof data == 'object') {
      requestOptions.body = JSON.stringify(data)
      requestOptions.headers['Content-Type'] = 'application/json'
    } else requestOptions.body = data
  }

  // Process custom headers
  Object.assign(requestOptions.headers, customHeaders)

  // Make abortable
  const controller = new AbortController()
  const { signal } = controller
  requestOptions.signal = signal

  const fetchPromise = fetch(requestUrl, requestOptions)
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

      let networkError
      if (response) {
        const text = await response.text()
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

  return new CancelablePromise(fetchPromise, {
    cancel: () => controller.abort(),
  })
}

export default apiRequest
