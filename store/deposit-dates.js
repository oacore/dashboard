import download from 'downloadjs'
import { action, computed, observable } from 'mobx'

import { Pages } from './helpers/pages'

import apiRequest from 'api'
import { NotFoundError } from 'api/errors'

class DepositDates {
  @observable isExportInProgress = false

  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = []

  @observable publicReleaseDates = null

  constructor(baseUrl) {
    const datesUrl = `${baseUrl}/public-release-dates`
    this.publicReleaseDates = new Pages(`${baseUrl}/public-release-dates`)
    this.datesUrl = datesUrl
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

  @action
  async retrieveDepositTimeLag() {
    this.isRetrieveDepositDatesInProgress = true
    try {
      const { data } = await apiRequest(this.depositTimeLagUrl, 'GET', {}, {})
        .promise
      this.timeLagData = data
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error
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
        { Accept: 'text/csv' }
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
      const { headers } = await apiRequest(this.datesUrl, 'HEAD', {}, {})
        .promise
      const length = headers.get('Collection-Length')
      this.depositDatesCount = Number.parseInt(length, 10) || null
    } catch (error) {
      if (error instanceof NotFoundError) this.isExportDisabled = true
      else throw error
    }
  }
}

export default DepositDates
