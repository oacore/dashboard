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

  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  timeLagData = timeLagData

  constructor(baseUrl) {
    this.datesUrl = `${baseUrl}/public-release-dates`
    this.statisticsUrl = `${baseUrl}/statistis/public-release-dates`
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

  async retrieveDepositDates(pageNumber, searchTerm, columnOrder) {
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

    let data
    try {
      const response = await apiRequest(this.datesUrl, 'GET', params, {}, true)
      data = response.data
    } catch (e) {
      if (e.status === 404) data = []
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
      const { data } = await apiRequest(
        this.datesUrl,
        'GET',
        { accept: 'text/csv' },
        { Accept: 'text/csv' },
        true
      )
      await download(data[0], 'deposit-dates.csv', 'text/csv')
    } finally {
      this.isExportInProgress = false
    }
  }

  @action
  loadDepositDatesCount = async () => {
    try {
      this.isExportDisabled = false
      const { headers } = await apiRequest(this.datesUrl, 'HEAD', {}, {}, true)
      this.depositDatesCount = headers.get('Collection-Length')
    } catch (e) {
      if (e.status === 404) this.isExportDisabled = true
      else throw e
    }
  }
}

export default DepositDates
