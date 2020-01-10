import download from 'downloadjs'
import { action, autorun, computed, observable } from 'mobx'

import Page from './helpers/page'
import getOrder from './helpers/order'
import timeLagData from './data'

import apiRequest from 'api'

const PAGE_SIZE = 100

const isServer = typeof window === 'undefined'

class DepositDates {
  pages = new Map([])

  @observable isExportInProgress = false

  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  timeLagData = timeLagData

  constructor(rootStore) {
    this.rootStore = rootStore

    // Register reactions
    this.onDataProviderChange()
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
      const r = await apiRequest(
        `/data-providers/${this.rootStore.dataProvider}/public-release-dates`,
        'GET',
        params,
        {},
        true
      )
      data = r.data
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
      const { data } = await apiRequest(
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
      this.isExportInProgress = true
    }
  }

  @action
  loadDepositDatesCount = async () => {
    try {
      this.isExportDisabled = false
      const r = await apiRequest(
        `/data-providers/${this.rootStore.dataProvider}/public-release-dates`,
        'HEAD',
        {
          accept: 'text/csv',
        },
        {
          'Content-Type': 'text/csv',
        },
        true
      )
      this.depositDatesCount = r.headers['collection-length']
    } catch (e) {
      if (e.statusCode === 404) this.isExportDisabled = true
      // else throw e
    }
  }

  onDataProviderChange = () =>
    autorun(() => {
      if (isServer) return
      this.loadDepositDatesCount()
    })
}

export default DepositDates
