import { action, observable } from 'mobx'

import Store from '../store'

class Membership extends Store {
  @observable members = []

  @observable membersUrl = `/members`

  constructor() {
    super()
    this.retrieveMembers()
  }

  @action
  async retrieveMembers() {
    const { data } = await this.request(this.membersUrl)
    this.members = data
  }
}

export default Membership
