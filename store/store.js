import { observable, action, autorun } from 'mobx'
import Router from 'next/router'

import User from './user'
import Works from './works'
import Route from '../pages/_app/route'

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

  constructor() {
    this.works = new Works(this)
    this.user = new User(this)

    // Register reactions
    this.onDataProviderChange()
  }

  @action changeDataProvider = dataProvider => {
    this.dataProvider = dataProvider
  }

  onDataProviderChange = () =>
    autorun(() => {
      const route = new Route(window.location.pathname)
      route.dataProvider = this.dataProvider
      Router.push(route.href, route.as)
    })
}

export default RootStore
