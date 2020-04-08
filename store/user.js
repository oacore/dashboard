import { action, observable, extendObservable } from 'mobx'

import Store from './store'

class User extends Store {
  @observable dataProviders = []

  owns(dataProviderId) {
    return this.dataProviders.some(({ id }) => dataProviderId === id)
  }

  searchDataProviders(searchTerm) {
    return this.dataProviders.filter(
      (e) => e.name.toLowerCase().search(searchTerm.toLowerCase()) !== -1
    )
  }

  @action
  async init() {
    await this.retrieveUser()
  }

  @action
  async retrieveUser() {
    const { data } = await this.request(this.url)
    const { dataProviders, ...userDetails } = data

    extendObservable(this, userDetails)
    this.dataProviders = dataProviders
  }

  @action
  async requestResetToken(data) {
    await this.request('/auth/reset', {
      method: 'POST',
      body: data,
    })
  }
}

export default User
