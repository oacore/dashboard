import { observable } from 'mobx'

import getOrder from '../order'
import invalidatePreviousRequests from '../invalidatePreviousRequests'
import Store from '../../store'
import { PaymentRequiredError } from '../../errors'

import { NotFoundError } from 'api/errors'

const PAGE_SIZE = 100

class Pages extends Store {
  @observable error = null

  @observable data = []

  searchTerm = ''

  columnOrder = {}

  type = ''

  pageNumber = 0

  totalLength = null

  isLastPageLoaded = false

  async slice(from, to) {
    while (this.data.length < to && !this.isLastPageLoaded) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.load()
      } catch (error) {
        if (error.name === 'AbortError') break
        throw error
      }
    }

    return this.data.slice(from, to)
  }

  reset({ columnOrder = {}, searchTerm = '', type = '' }) {
    this.data = []
    this.searchTerm = searchTerm
    this.columnOrder = columnOrder
    this.pageNumber = 0
    this.isLastPageLoaded = false
    this.type = type
  }

  @invalidatePreviousRequests
  load(signal) {
    const order = getOrder(this.columnOrder)

    const params = {
      from:
        this.data.length >= 100
          ? Math.round(this.data.length / 100)
          : this.data.length,
      size: PAGE_SIZE,
    }

    if (this.type) params.type = this.type
    if (order) params.orderBy = order
    if (this.searchTerm) params.q = this.searchTerm

    const request = this.request(this.url, { searchParams: params, signal })
    return new Promise((resolve, reject) =>
      request
        .then(({ data, headers }) => {
          if (this.pageNumber === 0) {
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
        })
        .catch((error) => {
          // AbortError is intentional. Propagate it one level up
          // and catch it there.
          // Don't set isLastPageLoaded flag here because it's not
          // semantically correct. It could have been solved like that though
          // since in the current implementation
          // page reset always follows after AbortError
          if (error.name === 'AbortError') return reject(error)

          // Resetting pointers to prevent pagination working
          this.isLastPageLoaded = true

          // We use NotFoundError to detect the end of the data stream
          // If it happens we avoid any error processing
          if (error instanceof NotFoundError) return resolve()

          // Storing the error to propagate messages to the UI
          this.error = error
          this.data = error.data || []

          if (error instanceof PaymentRequiredError) {
            // Stripping data to 5 elements only if there are more
            // These elements may be used as a preview
            this.data = this.data.slice(0, 5)

            // Cleaning the error up if there is no data.
            // The user would be frustrated that we are asking to pay providing
            // no data instead
            if (this.data.length === 0) this.error = null

            return resolve()
          }

          return reject(error)
        })
    )
  }
}

export default Pages
