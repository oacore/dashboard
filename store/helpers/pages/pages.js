import { observable } from 'mobx'

import getOrder from '../order'
import Page from './page'
import invalidatePreviousRequests from '../invalidatePreviousRequests'

import apiRequest from 'api'
import { NotFoundError } from 'api/errors'
import { LinkedList } from 'utils/linkedList'

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
      await this.load()

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
  load(signal) {
    const order = getOrder(this.#columnOrder)

    const params = {
      from: this.#pages.length,
      size: PAGE_SIZE,
    }
    if (order) params.orderBy = order
    if (this.#searchTerm) params.q = this.#searchTerm

    const request = apiRequest(this.url, { searchParams: params, signal })
    return new Promise((resolve, reject) =>
      request.then(
        ({ data }) => {
          const page = new Page(
            observable(
              data.map(e => ({
                ...e,
                id: `${this.#pageNumber}-${e.id}`,
                originalId: e.id,
              }))
            ),
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
          resolve(page)
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
  }

  getPageByNumber(pageNumber) {
    return this.#pages.get(pageNumber)
  }
}

export default Pages
