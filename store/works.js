import Page from './helpers/page'
import getOrder from './helpers/order'
import { CancelablePromise } from '../utils/promise'
import invalidatePreviousRequests from './helpers/invalidatePreviousRequests'

import apiRequest from 'api'

const PAGE_SIZE = 100

class Works {
  constructor(baseUrl) {
    this.worksUrl = `${baseUrl}/works`
  }

  @invalidatePreviousRequests
  retrieveWorks(pageNumber, searchTerm, columnOrder) {
    const order = getOrder(columnOrder)

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
    return new CancelablePromise(dataPromise, {
      cancel: request.cancel,
    })
  }
}

export default Works
