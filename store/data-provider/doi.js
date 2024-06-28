import { action, computed, observable, reaction } from 'mobx'

import { Pages } from '../helpers/pages'
import Store from '../store'

class DOI extends Store {
  baseStore = null

  constructor(rootStore, baseUrl, options) {
    super(baseUrl, options)
    this.baseStore = rootStore
    this.fetchOptions = {
      cache: 'no-store',
    }

    this.updateStatisticsUrl(baseUrl)
    this.updateDoiRecords(baseUrl)
    this.retrieveStatistics()
    reaction(
      () => this.baseStore?.setSelectedItem,
      () => {
        this.updateDoiRecords(baseUrl)
        this.updateStatisticsUrl(baseUrl)
      }
    )
  }

  @observable originCount = null

  @observable totalCount = null

  @observable doiRecords = null

  @action
  resetDoiRecords() {
    this.originCount = null
    this.totalCount = null
    this.doiRecords = null
  }

  @action
  updateStatisticsUrl = (baseUrl) => {
    this.statisticsUrl = `${baseUrl}/statistics/doi${
      this.baseStore?.setSelectedItem
        ? `?set=${this.baseStore?.setSelectedItem.setSpec}`
        : ''
    }`
  }

  @action
  updateDoiRecords = (baseUrl) => {
    const DUrl = `${baseUrl}/doi${
      this.baseStore?.setSelectedItem
        ? `?set=${this.baseStore?.setSelectedItem.setSpec}`
        : ''
    }`
    this.doiRecords = new Pages(DUrl, this.options)
    this.doiUrl = `${process.env.API_URL}${DUrl}?accept=text/csv`
  }

  @computed
  get enrichmentSize() {
    const { totalCount, originCount } = this
    const lag =
      totalCount != null && originCount != null
        ? totalCount - originCount
        : null

    if (lag != null && lag < 0) {
      if (process.env.NODE_ENV === 'development')
        console.error('DOI enrichment count is less then 0!', lag)
      return 0
    }

    return lag
  }

  @action
  retrieveStatistics = async () => {
    const { data } = await this.request(this.statisticsUrl, this.fetchOptions)
    this.originCount = data.dataProviderDoiCount
    this.totalCount = data.totalDoiCount
  }
}

export default DOI
