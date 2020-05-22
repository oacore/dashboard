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

class Root extends Store {
  static defaultOptions = {
    allowAnonymousAccess: false,

    request(url, options) {
      this.requestsInProgress += 1

      return apiRequest(url, options)
        .catch((error) => {
          if (error instanceof NetworkErrors.UnauthorizedError) {
            throw new AuthorizationError(
              `Authorization required for accessing to ${url}`
            )
          }

          if (error instanceof NetworkErrors.PaymentRequiredError) {
            throw new PaymentRequiredError(
              `Payment required for accessing to ${url}`
            )
          }

          if (error instanceof NetworkErrors.ForbiddenError)
            throw new AccessError(`${this.user} does not have access to ${url}`)

          throw error
        })
        .finally(() => {
          this.requestsInProgress -= 1
        })
    },
  }

  constructor(options) {
    super(null, options)
    this.options.request = this.options.request.bind(this)
  }

  @observable user = null

  @observable organisation = null

  @observable dataProvider = null

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
      this.user = new User()
      await this.user.retrieve()
    } catch (unauthorizedError) {
      if (!this.options.allowAnonymousAccess)
        throw new AuthorizationError('Anonymous users are not allowed')
    }

    const organisationUrl = `/organisations/${this.user.organisationId}`
    this.organisation = new Organisation(organisationUrl, this.options)

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
    this.retrieveStatistics()
    this.retrievePluginConfig()

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
}

export default Root
