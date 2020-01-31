import { action, observable, extendObservable } from 'mobx'

import apiRequest from 'api'

class User {
  @observable dataProviders = []

  owns(dataProviderId) {
    return this.dataProviders.some(({ id }) => dataProviderId === id)
  }

  baseUrl = ''

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  searchDataProviders(searchTerm) {
    return this.dataProviders.filter(
      e => e.name.toLowerCase().search(searchTerm.toLowerCase()) !== -1
    )
  }

  @action
  async init() {
    await this.retrieveUser()
  }

  @action
  async retrieveUser() {
    const { data } = await apiRequest(
      `${this.baseUrl}/user`,
      'GET',
      {},
      {},
      true
    ).promise
    const { dataProviders, ...userDetails } = data

    extendObservable(this, userDetails)
    this.dataProviders = dataProviders
  }
}

export default User
