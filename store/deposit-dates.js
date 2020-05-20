import { action, computed, observable } from 'mobx'

import { Pages } from './helpers/pages'
import Store from './store'

import { NotFoundError } from 'api/errors'

const { API_URL } = process.env

class DepositDates extends Store {
  @observable isExportDisabled = false

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = null

  @observable publicReleaseDates = null

  @observable crossDepositLag = null

  @observable publicationDatesValidate = null

  constructor(baseUrl, options) {
    super(baseUrl, options)

    const datesUrl = `${baseUrl}/public-release-dates`
    this.publicReleaseDates = new Pages(datesUrl, this.options)
    this.datesUrl = `${API_URL}${datesUrl}?accept=text/csv`
    this.depositTimeLagUrl = `${baseUrl}/statistics/deposit-time-lag`
    this.crossDepositLagUrL = `${baseUrl}/cross-deposit-lag`
    this.crossDepositLagCsvUrL = `${API_URL}${this.crossDepositLagUrL}?accept=text/csv`
    this.publicationDatesValidateUrl = `${baseUrl}/publication-dates-validate`

    this.retrieve()
  }

  @computed
  get totalCount() {
    return this.timeLagData?.reduce((acc, curr) => acc + curr.worksCount, 0)
  }

  @computed
  get nonCompliantCount() {
    return this.timeLagData?.reduce((acc, curr) => {
      if (curr.depositTimeLag > 90) return acc + curr.worksCount
      return acc
    }, 0)
  }

  @computed
  get complianceLevel() {
    if (this.totalCount == null || this.nonCompliantCount == null) return null
    if (this.totalCount === 0) return 0
    const level =
      ((this.totalCount - this.nonCompliantCount) / this.totalCount) * 100

    return Math.round(level * 100) / 100
  }

  @action
  async retrieveDepositTimeLag() {
    this.isRetrieveDepositDatesInProgress = true
    try {
      const { data } = await this.request(this.depositTimeLagUrl)
      this.timeLagData = data
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error
    } finally {
      this.isRetrieveDepositDatesInProgress = false
    }
  }

  @action
  async retrieveCrossDepositLag() {
    const response = await this.request(this.crossDepositLagUrL)

    // Use data only if status is 200 OK
    // Ignore body if got 202 Accepted
    const { status } = response
    const data = status === 200 || status === 0 ? response.data : {}

    this.crossDepositLag = data
  }

  @action
  async retrievePublicationDatesValidate() {
    const { data } = await this.request(this.publicationDatesValidateUrl)
    this.publicationDatesValidate = data
  }

  retrieve() {
    // 1. Doing it sequentially because of the API suffering
    //    from heavy concurrent requests
    // 2. Chaining Promises using finally() to handle unexpected rejections
    return this.retrieveDepositTimeLag()
      .finally(() => this.retrievePublicationDatesValidate())
      .finally(() => this.retrieveCrossDepositLag())
  }
}

export default DepositDates
