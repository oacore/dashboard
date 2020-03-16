import { action, computed, observable } from 'mobx'

import { Pages } from './helpers/pages'

import { API_URL } from 'config'
import apiRequest from 'api'
import { NotFoundError } from 'api/errors'

class DepositDates {
  @observable isExportDisabled = false

  @observable depositDatesCount = 0

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = []

  @observable publicReleaseDates = null

  constructor(baseUrl) {
    const datesUrl = `${baseUrl}/public-release-dates`
    this.publicReleaseDates = new Pages(`${baseUrl}/public-release-dates`)
    this.datesUrl = `${API_URL}${datesUrl}?accept=text/csv`
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
      const { data } = await apiRequest(this.depositTimeLagUrl)
      this.timeLagData = data
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error
    } finally {
      this.isRetrieveDepositDatesInProgress = false
    }
  }

  @action
  loadDepositDatesCount = async () => {
    try {
      this.isExportDisabled = false
      const { headers } = await apiRequest(this.datesUrl, { mehtod: 'HEAD' })
      const length = headers.get('Collection-Length')
      this.depositDatesCount = Number.parseInt(length, 10) || null
    } catch (error) {
      if (error instanceof NotFoundError) this.isExportDisabled = true
      else throw error
    }
  }
}

export default DepositDates
