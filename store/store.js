import { observable, action, autorun } from 'mobx'
import Router from 'next/router'

import DepositDates from './depositDates'
import Statistics from './statistics'
import User from './user'
import Works from './works'
import Route from '../pages/_app/route'

const isServer = typeof window === 'undefined'

class RootStore {
  @observable dataProvider = null

  @observable activity = null

  @observable repository = null

  @observable statistics = null

  @observable plugins = null

  /** @type Works */
  @observable works = null

  /** @type User */
  @observable user = null

  /** @type DepositDates */
  @observable depositDates = null

  constructor() {
    this.works = new Works(this)
    this.user = new User(this)
    this.depositDates = new DepositDates(this)
    this.statistics = new Statistics(this)

    // Register reactions
    this.onDataProviderChange()
  }

  @action changeDataProvider = dataProvider => {
    this.dataProvider = dataProvider
  }

  @action changeRepository = repository => {
    this.repository = repository
  }

  onDataProviderChange = () =>
    autorun(() => {
      if (isServer) return

      if (!this.dataProvider) return

      // TODO: Find a better place for it.
      this.statistics.onDataProviderChange(this.dataProvider)

      const dataProviderInt = parseInt(this.dataProvider, 10)
      if (!this.user.hasAccessToRepository(dataProviderInt)) {
        this.user.selectedRepositoryId = this.user.firstRepositoryId
        Router.push('/')
      } else if (dataProviderInt !== this.user.selectedRepositoryId) {
        this.user.selectedRepositoryId = dataProviderInt

        // redirect user to new repository
        const route = new Route(window.location.pathname)
        route.dataProvider = dataProviderInt
        Router.push(route.href, route.as)
      }
    })
}

export default RootStore
