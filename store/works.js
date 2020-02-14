import Page from './helpers/page'
import getOrder from './helpers/order'
import { makeCancelable } from '../utils/promise'

import apiRequest from 'api'

const PAGE_SIZE = 100

class Works {
  #requests = new Map([])

  constructor(baseUrl) {
    this.worksUrl = `${baseUrl}/works`
  }

  cancelAllPendingRequests() {
    this.#requests.forEach((promise, key) => {
      promise.cancelIfNotFulFilled()
      this.#requests.delete(key)
    })
  }

  async retrieveWorks(pageNumber, searchTerm, columnOrder) {
    const order = getOrder(columnOrder)
    const key = `${pageNumber}-${searchTerm}-${order}`

    this.cancelAllPendingRequests()

    const params = {
      from: pageNumber * PAGE_SIZE,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (searchTerm) params.q = searchTerm
    const request = apiRequest(this.worksUrl, 'GET', params, {}, true)
    const dataPromise = new Promise((resolve, reject) =>
      request.promise.then(
        ({ data }) => {
          const page = new Page(data, {
            searchTerm,
            order,
            maxSize: PAGE_SIZE,
          })
          resolve(page)
        },
        reason => reject(reason)
      )
    )

    const requestPromise = makeCancelable(dataPromise, {
      cancel: request.cancel,
    })

    this.#requests.set(key, requestPromise)
    return requestPromise.promise
  }
}

export default Works
