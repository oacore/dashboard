import Page from './helpers/page'

import apiRequest from 'api'

const PAGE_SIZE = 100

class DepositDates {
  pages = new Map([])

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  retrieveDepositDates = async (pageNumber, searchTerm) => {
    const key = `${this.rootStore.dataProvider}-${pageNumber}-${searchTerm}`
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.pages.has(key)) return this.pages.get(key)
    const [data] = await apiRequest(
      `/data-providers/${this.rootStore.dataProvider}/public-release-dates`,
      'GET',
      {
        from: pageNumber * PAGE_SIZE,
        size: PAGE_SIZE,
        q: searchTerm,
      },
      true
    )
    const page = new Page(data)
    this.pages.set(key, page)
    return page
  }
}

export default DepositDates
