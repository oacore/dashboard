import { action, observable, computed } from 'mobx'

import { Pages } from '../helpers/pages'
import Store from '../store'

const { API_URL } = process.env

class DOI extends Store {
  @observable originCount = null

  @observable totalCount = null

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

  @observable doiRecords = null

  constructor(baseUrl, options) {
    super(baseUrl, options)

    const doiUrl = `${baseUrl}/doi`
    this.doiRecords = new Pages(doiUrl, this.options)
    this.doiUrl = `${API_URL}${doiUrl}?accept=text/csv`

    this.statisticsUrl = `${baseUrl}/statistics/doi`
    this.retrieveStatistics()
  }

  @action
  retrieveStatistics = async () => {
    const { data } = await this.request(this.statisticsUrl)

    this.originCount = data.dataProviderDoiCount
    this.totalCount = data.totalDoiCount
  }
}

export default DOI
