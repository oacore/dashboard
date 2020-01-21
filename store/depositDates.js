import Page from './helpers/page'
import getOrder from './helpers/order'

import apiRequest from 'api'

const PAGE_SIZE = 100

class DepositDates {
  pages = new Map([])

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  retrieveDepositDates = async (pageNumber, searchTerm, columnOrder) => {
    const order = getOrder(columnOrder)
    const key = `${this.rootStore.dataProvider}-${pageNumber}-${searchTerm}-${order}`
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.pages.has(key)) return this.pages.get(key)

    const params = {
      from: pageNumber * PAGE_SIZE,
      size: PAGE_SIZE,
    }

    if (order) params.orderBy = order
    if (searchTerm) params.q = searchTerm

    let data
    try {
      ;[data] = await apiRequest(
        `/data-providers/${this.rootStore.dataProvider}/public-release-dates`,
        'GET',
        params,
        true
      )
    } catch (e) {
      if (e.statusCode === 404) data = []
      else throw e
    }

    const page = new Page(data)
    this.pages.set(key, page)
    return page
  }
}

export default DepositDates
