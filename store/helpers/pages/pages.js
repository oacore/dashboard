import getOrder from '../order'
import Page from './page'
import invalidatePreviousRequests from '../invalidatePreviousRequests'

import apiRequest from 'api'
import { NotFoundError } from 'api/errors'
import { LinkedList } from 'utils/linkedList'
import { CancelablePromise } from 'utils/promise'

const PAGE_SIZE = 100

class Pages {
  #pages = new LinkedList()

  #searchTerm = ''

  #columnOrder = ''

  #pageNumber = 0

  isLastPageLoaded = false

  isFirstPageLoaded = false

  constructor(url) {
    this.url = url
  }

  async slice(from, to) {
    while (this.#pages.length < to && !this.isLastPageLoaded)
      // eslint-disable-next-line no-await-in-loop
      await this.load().promise

    return this.#pages.data.slice(from, to)
  }

  reset({ columnOrder, searchTerm }) {
    this.#pages = new LinkedList()
    this.#searchTerm = searchTerm
    this.#columnOrder = columnOrder
    this.#pageNumber = 0
    this.isLastPageLoaded = false
    this.isFirstPageLoaded = false
  }

  @invalidatePreviousRequests
  load() {
    const order = getOrder(this.#columnOrder)

    const params = {
      from: this.#pageNumber * PAGE_SIZE,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (this.#searchTerm) params.q = this.#searchTerm
    const request = apiRequest(this.url, 'GET', params, {})
    const dataPromise = new Promise((resolve, reject) =>
      request.promise.then(
        ({ data }) => {
          const page = new Page(
            data.map(e => ({
              ...e,
              id: `${this.#pageNumber + 1}-${e.id}`,
              originalId: e.id,
            })),
            {
              searchTerm: this.#searchTerm,
              order,
              maxSize: PAGE_SIZE,
            }
          )
          if (this.#pageNumber === 0) this.isFirstPageLoaded = true
          this.#pageNumber += 1
          this.#pages.add(page)
          this.isLastPageLoaded = page.isLast
          resolve()
        },
        reason => {
          if (reason instanceof NotFoundError) {
            const page = new Page([], {
              searchTerm: this.#searchTerm,
              order,
              maxSize: PAGE_SIZE,
            })
            if (this.#pageNumber === 0) this.isFirstPageLoaded = true
            this.#pageNumber += 1
            this.#pages.add(page)
            this.isLastPageLoaded = page.isLast
            resolve()
          } else reject(reason)
        }
      )
    )

    return new CancelablePromise(dataPromise, {
      cancel: request.cancel,
    })
  }
}

export default Pages
