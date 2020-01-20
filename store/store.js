import { observable, action, autorun } from 'mobx'
import Router from 'next/router'

import DepositDates from './depositDates'
import User from './user'
import Works from './works'
import Route from '../pages/_app/route'

const isServer = typeof window === 'undefined'

class RootStore {
  @observable dataProvider = null

  @observable activity = null

  @observable repository = {
    id: 1,
    name: 'Open Research Online',
  }

  @observable plugins = null

  @observable works = null

  @observable user = null

  @observable depositDates = null

  constructor() {
    this.works = new Works(this)
    this.user = new User(this)
    this.depositDates = new DepositDates(this)

    // Register reactions
    this.onDataProviderChange()
  }

  @action changeDataProvider = dataProvider => {
    this.dataProvider = dataProvider
  }

  onDataProviderChange = () =>
    autorun(() => {
      if (isServer) return
      const route = new Route(window.location.pathname)
      route.dataProvider = this.dataProvider
      Router.push(route.href, route.as)
    })
}

export default RootStore
