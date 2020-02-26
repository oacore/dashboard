import { observable, action, computed } from 'mobx'

import activities from './activities'
import Store from './store'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'
import { logTiming } from '../utils/analytics'

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

  @observable user = new User(this.options)

  @observable dataProvider = null

  @observable activity = null

  @observable statistics = {
    metadataCount: null,
    fullTextCount: null,
    doiCount: null,
  }

  @observable plugins = {
    discovery: null,
    recommender: null,
  }

  @observable works = null

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

  @action async init(dataProviderId, activityPath) {
    await this.user.init()
    try {
      this.changeDataProvider(dataProviderId)
      this.changeActivity(activityPath)
    } catch (accessError) {
      const fallbackId = this.user.dataProviders[0].id
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(
          accessError.message,
          `Fall back to DataProvider ${fallbackId}`
        )
      }
      this.changeDataProvider(fallbackId)
    }
  }

  // TODO: Should be renamed to switchDataProvider
  @action changeDataProvider(dataProviderStr) {
    const dataProviderId = Number.parseInt(dataProviderStr, 10)

    if (this.dataProvider && this.dataProvider.id === dataProviderId) return
    const dataProvider = this.user.dataProviders.find(
      ({ id }) => dataProviderId === id
    )

    if (dataProvider == null) {
      throw new Error(
        `User ${this.user.id} does not have access to DataProvider ${dataProviderId}.`
      )
    }

    this.dataProvider = dataProvider
    this.changeActivity('overview')

    this.retrieveStatistics()
    this.retrievePluginConfig()

    this.works = new Works(this.baseUrl, this.options)
    this.depositDates = new DepositDates(this.baseUrl, this.options)
  }

  @action changeActivity(url) {
    const activity =
      activities.find(({ path }) => url === path) || activities.get('overview')

    if (this.activity?.path === url) return
    this.activity = activity
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

    data.forEach(plugin => {
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
