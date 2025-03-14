import { action, computed, observable, reaction } from 'mobx'

import Store from '../store'
import { PaymentRequiredError } from '../errors'

import { NotFoundError } from 'api/errors'

class DepositDates extends Store {
  baseStore = null

  @observable isRetrieveDepositDatesInProgress = false

  @observable timeLagData = null

  @observable publicReleaseDates = []

  @observable isPublicReleaseDatesInProgress = false

  @observable crossDepositLag = null

  @observable publicationDatesValidate = null

  @observable dateRange = {
    startDate: null,
    endDate: null,
  }

  constructor(rootStore, baseUrl, options) {
    super(baseUrl, options)
    this.baseStore = rootStore
    this.baseUrl = baseUrl
    this.fetchOptions = {
      cache: 'no-store',
    }

    const today = `${new Date().toISOString().split('T')[0]} 00:00:00`
    const defaultStartDate = '2021-01-01 00:00:00'

    this.setDateRange(defaultStartDate, today)

    this.updateOaiUrl(baseUrl, defaultStartDate, today)

    reaction(
      () => this.baseStore?.setSelectedItem,
      () => {
        this.updateOaiUrl(
          baseUrl,
          this.dateRange.startDate,
          this.dateRange.endDate
        )
      }
    )
  }

  @action
  setPublicReleaseDates(data) {
    this.publicReleaseDates = data
  }

  @action
  setDateRange(startDate, endDate) {
    this.dateRange = {
      startDate,
      endDate,
    }
  }

  @action
  resetCompliance() {
    this.timeLagData = null
    this.publicReleaseDates = null
    this.crossDepositLag = null
    this.publicationDatesValidate = null
    this.dateRange = {
      startDate: null,
      endDate: null,
    }
  }

  @action
  updateOaiUrl = (baseUrl, startDate, endDate) => {
    const dateParams =
      startDate && endDate
        ? `?wait=true&fromDate=${startDate}&toDate=${endDate}`
        : '?wait=true'

    const datesUrl = `${baseUrl}/public-release-dates${
      this.baseStore.setSelectedItem
        ? `?set=${this.baseStore.setSelectedItem}`
        : ''
    }`
    this.publicReleaseDatesUrl = `${baseUrl}/public-release-dates${
      this.baseStore.setSelectedItem
        ? `?set=${this.baseStore.setSelectedItem}`
        : ''
    }`

    this.datesUrl = `${process.env.API_URL}${datesUrl}${dateParams}&accept=text/csv`

    this.depositTimeLagUrl = `${baseUrl}/statistics/deposit-time-lag${
      this.baseStore.setSelectedItem
        ? `?set=${this.baseStore.setSelectedItem}`
        : ''
    }${dateParams}`
    this.crossDepositLagUrl = `${baseUrl}/cross-deposit-lag${
      this.baseStore.setSelectedItem
        ? `?set=${this.baseStore.setSelectedItem}`
        : ''
    }${dateParams}`
    this.crossDepositLagCsvUrl = `${process.env.API_URL}${this.crossDepositLagUrl}&accept=text/csv`
    this.publicationDatesValidateUrl = `${baseUrl}/publication-dates-validate${
      this.baseStore.setSelectedItem
        ? `?set=${this.baseStore.setSelectedItem}`
        : ''
    }${dateParams}`

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
  async retrieveDepositDatesTable(
    from = 0,
    size = 100,
    orderBy = null,
    searchTerm = '',
    options = {}
  ) {
    this.isPublicReleaseDatesInProgress = true
    try {
      const baseUrl = this.publicReleaseDatesUrl.startsWith('http')
        ? this.publicReleaseDatesUrl
        : `${process.env.API_URL}${this.publicReleaseDatesUrl}`

      const url = new URL(baseUrl)
      url.searchParams.append('from', from)
      url.searchParams.append('size', size)

      if (options.wait) url.searchParams.append('wait', options.wait)
      if (options.fromDate)
        url.searchParams.append('fromDate', options.fromDate)
      if (options.toDate) url.searchParams.append('toDate', options.toDate)

      if (searchTerm) url.searchParams.append('q', searchTerm)

      if (orderBy) url.searchParams.append('orderBy', orderBy)

      const response = await this.request(url.toString())
      const { data, error } = response

      if (from === 0) this.setPublicReleaseDates(data)
      else this.setPublicReleaseDates([...this.publicReleaseDates, ...data])

      this.publicReleaseDatesError = error
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error
    } finally {
      this.isPublicReleaseDatesInProgress = false
    }
  }

  @action
  async retrieveCrossDepositLag() {
    const response = await this.request(this.crossDepositLagUrl)

    // Use data only if status is 200 OK
    // Ignore body if got 202 Accepted
    const { status } = response
    const data = status === 200 || status === 0 ? response.data : {}

    // TODO: Remove the following workaround when we have a data table
    // Waiting for 2 requests to disable loading once having both data
    // and error, it prevents user confusion if the data changes
    data.error = await this.request(this.crossDepositLagCsvUrl, {
      method: 'HEAD',
    }).then(
      () => null, // return no error if data retrieving is successful
      (error) => error // pass the error above
    )

    // Clean the error up if we have no data to export
    // This prevents showing the message when there is nothing to sell
    if (data.error instanceof PaymentRequiredError && !data.possibleBonusCount)
      data.error = null

    this.crossDepositLag = data
  }

  @action
  async retrievePublicationDatesValidate() {
    const { data } = await this.request(this.publicationDatesValidateUrl)
    this.publicationDatesValidate = data
  }

  retrieve() {
    this.retrieveDepositTimeLag()
    this.retrievePublicationDatesValidate()
    this.retrieveCrossDepositLag()
  }
}

export default DepositDates
