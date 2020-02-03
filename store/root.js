import { observable, action, computed } from 'mobx'

import activities from './activities'
import User from './user'
import DepositDates from './deposit-dates'
import Works from './works'
import profiles from '../profiles'

import apiRequest from 'api'
import SessionStorageWrapper from 'utils/sessionStorageWrapper'

class Root {
  @observable dataProvider = null

  @observable activity = null

  @observable statistics = {
    metadataCount: null,
    fullTextCount: null,
    doiCount: null,
  }

  @observable works = null

  @observable depositDates = null

  @observable user = null

  @observable profile =
    SessionStorageWrapper.getValue('profile', true) || PROFILE_DATA

  @computed
  get baseUrl() {
    return `${this.profile.apiURL}/internal`
  }

  @computed
  get dataProviders() {
    return this.user.dataProviders
  }

  constructor() {
    this.user = new User(this.baseUrl)
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
    this.reloadStore()
  }

  @action changeActivity(url) {
    const activity =
      activities.find(({ path }) => url === path) || activities.get('overview')
    this.activity = activity
  }

  @action
  async retrieveStatistics() {
    const url = `${this.baseUrl}/data-providers/${this.dataProvider.id}/statistics`
    const { data } = await apiRequest(url, 'GET', {}, {}).promise
    Object.assign(this.statistics, data)
  }

  @action
  reloadStore() {
    this.retrieveStatistics()

    const url = `${this.baseUrl}/data-providers/${this.dataProvider.id}`

    this.works = new Works(url)
    this.depositDates = new DepositDates(url)
  }

  @action
  async changeProfile(profile) {
    const LOGOUT_URL = `${
      this.profile.apiURL
    }/logout?continue=${encodeURIComponent(
      typeof window !== 'undefined'
        ? `${window.location.origin}/login.html`
        : ''
    )}`

    SessionStorageWrapper.setValue('profile', JSON.stringify(profiles[profile]))
    window.location.replace(LOGOUT_URL)
  }
}

export default Root
