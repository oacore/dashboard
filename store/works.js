import Page from './helpers/page'
import getOrder from './helpers/order'

import apiRequest from 'api'

const PAGE_SIZE = 100

class Works {
  pages = new Map([])

  constructor(baseUrl) {
    this.worksUrl = `${baseUrl}/works`
  }

  retrieveWorks(pageNumber, searchTerm, columnOrder) {
    const order = getOrder(columnOrder)
    const key = `${pageNumber}-${searchTerm}-${order}`
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.pages.has(key)) {
      return {
        promise: Promise.resolve(this.pages.get(key)),
        cancel: () => {},
      }
    }

    const params = {
      from: pageNumber * PAGE_SIZE,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (searchTerm) params.q = searchTerm
    const request = apiRequest(this.worksUrl, 'GET', params, {})
    const dataPromise = new Promise((resolve, reject) =>
      request.promise.then(
        ({ data }) => {
          const page = new Page(data, {
            searchTerm,
            order,
            maxSize: PAGE_SIZE,
          })
          this.pages.set(key, page)
          resolve(page)
        },
        reason => reject(reason)
      )
    )
    return {
      promise: dataPromise,
      cancel: request.cancel,
    }
  }
}

export default Works
