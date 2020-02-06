import download from 'downloadjs'
import { action, computed, observable } from 'mobx'

import Page from './helpers/page'
import getOrder from './helpers/order'

import apiRequest from 'api'

const PAGE_SIZE = 30

class DepositDates {
  pages = new Map([])

  @observable isExportInProgress = false

  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = []

  constructor(baseUrl) {
    this.datesUrl = `${baseUrl}/public-release-dates`
    this.depositTimeLagUrl = `${baseUrl}/statistics/deposit-time-lag`

    this.retrieveDepositTimeLag()
    this.loadDepositDatesCount()
  }

  @computed
  get complianceLevel() {
    const [total, compliant] = this.timeLagData.reduce(
      (acc, curr) => {
        acc[0] += curr.worksCount

        if (curr.depositTimeLag <= 90) acc[1] += curr.worksCount
        return acc
      },
      [0, 0]
    )

    if (total === 0) return 0
    const level = (compliant / total) * 100
    return Math.round(level * 100) / 100
  }

  retrieveDepositDates(pageNumber, searchTerm, columnOrder) {
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
      next_item: pageNumber * PAGE_SIZE,
      step_item: PAGE_SIZE,
    }

    if (order) params.orderBy = order
    if (searchTerm) params.q = searchTerm

    const request = apiRequest(this.datesUrl, 'GET', params, {}, true)
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
        reason => {
          if (reason.status === 404) {
            const page = new Page([], {
              searchTerm,
              order,
              maxSize: PAGE_SIZE,
            })
            this.pages.set(key, page)
            resolve(page)
          } else reject(reason)
        }
      )
    )
    return {
      promise: dataPromise,
      cancel: request.cancel,
    }
  }

  @action
  async retrieveDepositTimeLag() {
    this.isRetrieveDepositDatesInProgress = true
    try {
      const { data } = await apiRequest(
        this.depositTimeLagUrl,
        'GET',
        {},
        {},
        true
      ).promise
      this.timeLagData = data
    } catch (e) {
      if (e.status !== 404) throw e
    } finally {
      this.isRetrieveDepositDatesInProgress = false
    }
  }

  @action
  exportCsv = async () => {
    this.isExportInProgress = true
    try {
      const { data } = await apiRequest(
        this.datesUrl,
        'GET',
        { accept: 'text/csv' },
        { Accept: 'text/csv' },
        true
      ).promise
      await download(data, 'deposit-dates.csv', 'text/csv')
    } finally {
      this.isExportInProgress = false
    }
  }

  @action
  loadDepositDatesCount = async () => {
    try {
      this.isExportDisabled = false
      const { headers } = await apiRequest(this.datesUrl, 'HEAD', {}, {}, true)
        .promise
      const length = headers.get('Collection-Length')
      this.depositDatesCount = Number.parseInt(length, 10) || null
    } catch (e) {
      if (e.status === 404) this.isExportDisabled = true
      else throw e
    }
  }
}

export default DepositDates
