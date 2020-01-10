import { action } from 'mobx'

import apiRequest from '../api'

class User {
  isAdmin = null

  id = null

  name = null

  givenName = null

  familyName = null

  email = null

  url = null

  organisationId = null

  affiliationUrl = null

  permissionsUrl = null

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  logIn = async () => {
    await this.retrieveUser()
  }

  @action
  retrieveUser = async () => {
    const user = await apiRequest('/user', 'GET', {}, {}, true)
    this.rootStore.changeDataProvider(user.organisationId)
    Object.assign(this, user)
  }

  @action
  loadUserPermissions = async () => {
    // if (!this.permissionsUrl) return
    // const permission = await apiRequest(this.permissionsUrl)
  }
}

export default User
