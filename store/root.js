import { observable, action, computed } from 'mobx'

import activities from './activities'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'

import apiRequest from 'api'

class Root {
  @observable user = new User()

  @observable dataProvider = null

  @observable activity = null

  @observable statistics = {
    metadataCount: null,
    fullTextCount: null,
    doiCount: null,
  }

  @observable integrations = {
    key: null,
  }

  // @observable integrations = {}

  @observable works = null

  @observable depositDates = null

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
    this.retrieveAPI()

    const url = `/data-providers/${this.dataProvider.id}`
    this.works = new Works(url)
    this.depositDates = new DepositDates(url)
  }

  @action changeActivity(url) {
    const activity =
      activities.find(({ path }) => url === path) || activities.get('overview')
    this.activity = activity
  }

  @action
  async retrieveStatistics() {
    const url = `/data-providers/${this.dataProvider.id}/statistics`
    const { data } = await apiRequest(url, 'GET', {}, {}, true).promise
    Object.assign(this.statistics, data)
  }

  @action
  async retrieveAPI() {
    const url = `/data-providers/${this.dataProvider.id}/integrations`
    const { data } = await apiRequest(url, 'GET', {}, {}, true).promise
    Object.assign(this.integrations, data)
  }
}

export default Root
