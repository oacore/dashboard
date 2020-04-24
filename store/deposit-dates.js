import { action, computed, observable } from 'mobx'

import { Pages } from './helpers/pages'
import Store from './store'

import { NotFoundError } from 'api/errors'

const { API_URL } = process.env

class DepositDates extends Store {
  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = []

  @observable publicReleaseDates = null

  @observable publicationDatesValidate = null

  constructor(baseUrl, options) {
    super(baseUrl, options)

    const datesUrl = `${baseUrl}/public-release-dates`
    this.publicReleaseDates = new Pages(datesUrl, this.options)
    this.datesUrl = `${API_URL}${datesUrl}?accept=text/csv`
    this.depositTimeLagUrl = `${baseUrl}/statistics/deposit-time-lag`
    this.publicationDatesValidateUrl = `${baseUrl}/publication-dates-validate`

    this.retrieveDepositTimeLag()
    this.loadDepositDatesCount()
    this.getPublicationDatesValidate()
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
  async loadDepositDatesCount() {
    try {
      this.isExportDisabled = false
      const { headers } = await this.request(this.datesUrl, {
        method: 'HEAD',
      })
      const length = headers.get('Collection-Length')
      const number = Number.parseInt(length, 10)
      this.depositDatesCount = number >= 0 ? number : null
    } catch (error) {
      if (error instanceof NotFoundError) this.isExportDisabled = true
      else throw error
    }
  }

  @action
  async getPublicationDatesValidate() {
    const { data } = await this.request(this.publicationDatesValidateUrl)
    this.publicationDatesValidate = data
  }
}

export default DepositDates
