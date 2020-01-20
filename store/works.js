import apiRequest from '@oacore/api/dist/request/request'

import Page from './helpers/page'

const PAGE_SIZE = 100

class Works {
  pages = new Map([])

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  retrieveWorks = async (pageNumber, searchTerm) => {
    const key = `${this.rootStore.dataProvider}-${pageNumber}-${searchTerm}`
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.pages.has(key)) return this.pages.get(key)
    const [data] = await apiRequest(
      `/data-providers/${this.rootStore.dataProvider}/works`,
      'GET',
      {
        from: pageNumber * PAGE_SIZE,
        size: PAGE_SIZE,
        q: searchTerm,
      }
    )
    const page = new Page(data)
    this.pages.set(key, page)
    return page
  }
}

export default Works
