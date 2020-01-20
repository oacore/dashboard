import download from 'downloadjs'
import { action, computed, observable } from 'mobx'

import Page from './helpers/page'
import getOrder from './helpers/order'
import timeLagData from './data'

import apiRequest from 'api'

const PAGE_SIZE = 100

class DepositDates {
  pages = new Map([])

  @observable isExportInProgress = false

  timeLagData = timeLagData

  constructor(rootStore) {
    this.rootStore = rootStore
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
        {},
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

  @action
  exportCsv = async () => {
    this.isExportInProgress = true
    try {
      const data = await apiRequest(
        `/data-providers/${this.rootStore.dataProvider}/public-release-dates`,
        'GET',
        {
          accept: 'text/csv',
        },
        {
          'Content-Type': 'text/csv',
        },
        true
      )
      await download(data[0], 'deposit-dates.csv', 'text/csv')
    } finally {
      this.isExportInProgress = false
    }
  }
}

export default DepositDates
