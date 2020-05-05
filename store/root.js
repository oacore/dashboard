import { observable, action, computed } from 'mobx'

import Store from './store'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'
import DOI from './doi'
import Issues from './issues'
import { logTiming } from '../utils/analytics'
import Organisation from './organisation'

import apiRequest from 'api'

class Root extends Store {
  constructor() {
    const request = async (url, options) => {
      this.requestsInProgress += 1
      const startTime = Date.now()

      try {
        return await apiRequest(url, options)
      } finally {
        this.requestsInProgress -= 1
        const endpoint = `${options?.method || 'GET'} ${this.baseUrl}${url}`
        logTiming({
          category: 'API calls',
          value: Date.now() - startTime,
          variable: endpoint.replace(/\d+/g, '<id>'),
          label: endpoint,
        })
      }
    }

    super(null, { request })
  }

  @observable user = new User('/user', this.options)

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
    return this.user.dataProviders
  }

  @computed
  get baseUrl() {
    if (!this.dataProvider) return null
    return `/data-providers/${this.dataProvider.id}`
  }

  @action async init(dataProviderId) {
    await this.user.init()
    this.changeDataProvider(dataProviderId)

    const organisationUrl = `/organisations/${this.user.organisationId}`
    this.organisation = new Organisation(organisationUrl, this.options)
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
      const userStr = `User#${this.user.id}`
      const dpStr = `DataProvider#${id}`
      throw new Error(`${userStr} does not have access to the ${dpStr}`)
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
