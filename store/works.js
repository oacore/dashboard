import Page from './helpers/page'
import getOrder from './helpers/order'

import apiRequest from 'api'

const PAGE_SIZE = 100

class Works {
  pages = new Map([])

  constructor(baseUrl) {
    this.worksUrl = `${baseUrl}/works`
  }

  async retrieveWorks(pageNumber, searchTerm, columnOrder) {
    const order = getOrder(columnOrder)
    const key = `${pageNumber}-${searchTerm}-${order}`
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.pages.has(key)) return this.pages.get(key)
    const params = {
      from: pageNumber * PAGE_SIZE,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (searchTerm) params.q = searchTerm
    const { data } = await apiRequest(this.worksUrl, 'GET', params, {}, true)
      .promise
    const page = new Page(data, {
      searchTerm,
      order,
    })
    this.pages.set(key, page)
    return page
  }
}

export default Works
