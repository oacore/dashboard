import { observable } from 'mobx'

import getOrder from '../order'
import invalidatePreviousRequests from '../invalidatePreviousRequests'
import Store from '../../store'

import { NotFoundError } from 'api/errors'

const PAGE_SIZE = 100
class Pages extends Store {
  @observable data = []

  searchTerm = ''

  columnOrder = ''

  pageNumber = 0

  totalLength = null

  isLastPageLoaded = false

  isFirstPageLoaded = false

  async slice(from, to) {
    while (this.data.length < to && !this.isLastPageLoaded) {
      // eslint-disable-next-line no-await-in-loop
      await this.load()
    }

    return this.data.slice(from, to)
  }

  reset({ columnOrder, searchTerm }) {
    this.data = []
    this.searchTerm = searchTerm
    this.columnOrder = columnOrder
    this.pageNumber = 0
    this.isLastPageLoaded = false
    this.isFirstPageLoaded = false
  }

  @invalidatePreviousRequests
  load(signal) {
    const order = getOrder(this.columnOrder)

    const params = {
      from: this.data.length,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (this.searchTerm) params.q = this.searchTerm

    const request = this.request(this.url, { searchParams: params, signal })
    return new Promise((resolve, reject) =>
      request.then(
        ({ data, headers }) => {
          if (this.pageNumber === 0) {
            this.isFirstPageLoaded = true
            const length = headers.get('Collection-Length')
            const number = Number.parseInt(length, 10)
            this.totalLength = number >= 0 ? number : null
          }
          this.pageNumber += 1
          const transformedData = data.map((e) => ({
            ...e,
            id: `${this.pageNumber}-${e.id}`,
            originalId: e.id,
          }))
          this.data.push(...transformedData)
          this.isLastPageLoaded =
            this.isLastPageLoaded || transformedData.length === 0
          resolve(transformedData)
        },
        (reason) => {
          if (reason instanceof NotFoundError) {
            if (this.pageNumber === 0) this.isFirstPageLoaded = true
            this.isLastPageLoaded = true
            this.pageNumber += 1
            resolve()
          } else reject(reason)
        }
      )
    )
  }
}

export default Pages
