import { observable, action, autorun } from 'mobx'
import Router from 'next/router'

import DepositDates from './depositDates'
import Statistics from './statistics'
import User from './user'
import Works from './works'
import Route from '../pages/_app/route'
import DataProviders from './dataProviders'

const isServer = typeof window === 'undefined'

class RootStore {
  @observable dataProvider = null

  @observable activity = null

  @observable repository = {
    id: 1,
    name: 'Open Research Online',
  }

  @observable statistics = null

  @observable plugins = null

  @observable works = null

  @observable user = null

  @observable depositDates = null

  constructor() {
    this.works = new Works(this)
    this.user = new User(this)
    this.dataProviders = new DataProviders(this)
    this.depositDates = new DepositDates(this)
    this.statistics = new Statistics(this)

    // Register reactions
    this.onDataProviderChange()
  }

  @action changeDataProvider = dataProvider => {
    this.dataProvider = dataProvider
  }

  onDataProviderChange = () =>
    autorun(() => {
      if (isServer) return

      // if user has no access to dataProvider redirect them
      const route = new Route(Router.asPath)
      if (
        route.dataProvider &&
        parseInt(route.dataProvider, 10) !== this.user.organisationId
      ) {
        this.changeDataProvider(this.user.organisationId)
        Router.push('/')
      }
    })
}

export default RootStore
