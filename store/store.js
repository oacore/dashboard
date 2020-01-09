import { observable } from 'mobx'

import User from './user'
import Works from './works'

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
  }
}

export default RootStore
