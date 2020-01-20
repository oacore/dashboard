import axios from 'axios'

import { NetworkError } from './errors'

const CORE_API = 'https://api.core.ac.uk/internal'
const CORE_API_DEV = 'https://api.dev.core.ac.uk/internal'

const apiRequest = async (url, method = 'GET', params = {}, dev = true) => {
  try {
    const response = await axios({
      url: `${dev ? CORE_API_DEV : CORE_API}${url}`,
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return [response.data, response.status]
  } catch (e) {
    const { response, message } = e
    let networkError
    if (response) {
      networkError = new NetworkError(
        `Request for ${method} ${url} failed. Response: ${response.status}, ${response.data}`
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
    networkError.statusCode = (response && response.status) || 500
    throw networkError
  }
}

export default apiRequest
