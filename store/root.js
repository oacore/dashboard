import { observable, action, computed } from 'mobx'

import activities from './activities'
import Store from './store'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'

import apiRequest from 'api'

class Root extends Store {
  constructor() {
    const request = async (...args) => {
      this.requestsInProgress += 1
      try {
        return await apiRequest(...args)
      } finally {
        this.requestsInProgress -= 1
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

    const url = `/data-providers/${this.dataProvider.id}`
    this.works = new Works(url, this.options)
    this.depositDates = new DepositDates(url, this.options)
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
}

export default Root
