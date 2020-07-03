import { observable, action, computed } from 'mobx'

import Store from './store'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'
import DOI from './doi'
import Issues from './issues'
import Organisation from './organisation'
import { AccessError, AuthorizationError, PaymentRequiredError } from './errors'

import apiRequest from 'api'
import * as NetworkErrors from 'api/errors'

const REPEADTED_REQUEST_TIMEOUT = 30000
const REPEADTED_REQUEST_LIMIT = 5

class Root extends Store {
  static defaultOptions = {
    allowAnonymousAccess: false,

    request(url, options) {
      let attemptCount = 0

      const requestContinuously = () => {
        attemptCount += 1
        if (attemptCount < 2) this.requestsInProgress += 1

        return apiRequest(url, options)
          .finally(() => {
            if (attemptCount < 2) this.requestsInProgress -= 1
          })
          .then((response) =>
            response.status === 202 && attemptCount < REPEADTED_REQUEST_LIMIT
              ? new Promise((resolve, reject) => {
                  const repeatedRequest = () =>
                    requestContinuously(url, options).then(resolve, reject)
                  setTimeout(repeatedRequest, REPEADTED_REQUEST_TIMEOUT)
                })
              : response
          )
      }

      return requestContinuously().catch((error) => {
        if (error instanceof NetworkErrors.UnauthorizedError) {
          throw new AuthorizationError(
            `Authorization required for accessing to ${url}`
          )
        }

        if (error instanceof NetworkErrors.PaymentRequiredError) {
          const targetError = new PaymentRequiredError(
            `Payment required for accessing to ${url}`
          )
          targetError.data = error.data
          throw targetError
        }

        if (error instanceof NetworkErrors.ForbiddenError)
          throw new AccessError(`${this.user} does not have access to ${url}`)

        throw error
      })
    },
  }

  constructor(options) {
    super(null, options)
    this.options.request = this.options.request.bind(this)
  }

  contactUrl = `${process.env.API_URL}/contact`

  @observable user = null

  @observable organisation = null

  @observable dataProvider = null

  @observable irus = null

  @observable rioxx = null

  @observable statistics = {
    metadataCount: null,
    fullTextCount: null,
  }

  @observable plugins = {
    discovery: null,
    recommender: null,
  }

  @observable works = null

  @observable issues = null

  @observable depositDates = null

  @observable requestsInProgress = 0

  @computed
  get isLoading() {
    return this.requestsInProgress > 0
  }

  @computed
  get dataProviders() {
    return this.user?.dataProviders
  }

  @computed
  get baseUrl() {
    if (!this.dataProvider) return null
    return `/data-providers/${this.dataProvider.id}`
  }

  @action async init(dataProviderId) {
    try {
      this.user = new User({}, this.options)
      await this.user.retrieve()
    } catch (unauthorizedError) {
      if (!this.options.allowAnonymousAccess)
        throw new AuthorizationError('Anonymous users are not allowed')
    }
    this.organisation = new Organisation(this.user.affiliationUrl, this.options)

    this.organisation.retrieve()

    this.changeDataProvider(dataProviderId)
  }

  @action changeDataProvider(id) {
    // Clean-up or initial request
    if (id == null) {
      this.dataProvider = null
      return
    }

    // Compare strings and numbers
    // since we do not really know what type of ID the API exposes
    // eslint-disable-next-line eqeqeq
    const hasTargetId = (dataProvider) => id == dataProvider.id

    // Probably a repeated request. No need to change
    if (this.dataProvider != null && hasTargetId(this.dataProvider)) return

    // Check access rights
    // TODO: Should be moved or ideally removed
    const dataProvider = this.dataProviders.find(hasTargetId)
    if (dataProvider == null) {
      const dpStr = `DataProvider#${id}`
      throw new AccessError(`${this.user} does not have access to the ${dpStr}`)
    }

    this.dataProvider = dataProvider
    this.reset()
    this.retrieveStatistics()
    this.retrievePluginConfig()
    this.retrieveIrusStats()
    this.retrieveRioxxStats()

    const url = `/data-providers/${this.dataProvider.id}`
    this.works = new Works(url, this.options)
    this.depositDates = new DepositDates(url, this.options)
    this.doi = new DOI(url, this.options)
    this.issues = new Issues(url, this.options)
  }

  @action
  async retrieveStatistics() {
    const url = `/data-providers/${this.dataProvider.id}/statistics`
    const { data } = await this.request(url)
    Object.assign(this.statistics, data)
  }

  @action
  async retrievePluginConfig() {
    const url = `/data-providers/${this.dataProvider.id}/plugins`
    const { data } = await this.request(url)

    data.forEach((plugin) => {
      this.plugins[plugin.type] = plugin
    })
  }

  @action
  async updateDataProvider(patch) {
    try {
      // TODO: Should be this.dataProvider.url
      const url = `/data-providers/${this.dataProvider.id}`
      const { data } = await apiRequest(url, {
        method: 'PATCH',
        body: patch,
      })
      Object.assign(this.dataProvider, data)
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action
  async updateOrganization(patch) {
    const { name: institution } = patch
    this.updateDataProvider({ institution })

    // TODO: Should be a method without cross-call to another method
  }

  @action
  async retrieveIrusStats() {
    try {
      const url = `/data-providers/${this.dataProvider.id}/irus`
      const { data } = await apiRequest(url)
      this.irus = data
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action async retrieveRioxxStats() {
    try {
      const url = `/data-providers/${this.dataProvider.id}/rioxx/aggregation`
      const { data } = await apiRequest(url)
      const {
        compliantRecordBasic: partiallyCompliantCount,
        compliantRecordFull: compliantCount,
        totalRecords: totalCount,
        ...rest
      } = data

      this.rioxx = {
        partiallyCompliantCount,
        compliantCount,
        totalCount,
        ...rest,
      }
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  async sendContactRequest(data) {
    try {
      await this.request(this.contactUrl, { method: 'POST', body: data })
      return true
    } catch (anyError) {
      if (process.env.NODE_ENV !== 'production') console.error(anyError)
      return false
    }
  }

  @action
  async reset() {
    this.irus = null
    this.rioxx = null
  }

  requestResetToken(data) {
    return this.request('/auth/reset', {
      method: 'POST',
      body: data,
    })
  }
}

export default Root
