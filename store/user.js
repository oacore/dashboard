import { action, computed, observable } from 'mobx'

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

  @observable selectedRepositoryId = 0

  @observable repositories = []

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed get selectedRepository() {
    return this.repositories.find(e => e.id === this.selectedRepositoryId)
  }

  @computed get firstRepositoryId() {
    return this.repositories[0] && this.repositories[0].id
  }

  hasAccessToRepository(repositoryId) {
    return this.repositories.some(e => e.id === repositoryId)
  }

  @action
  logIn = async () => {
    await this.retrieveUser()
    await this.loadDataProviders()
  }

  @action
  retrieveUser = async () => {
    const { data } = await apiRequest('/user', 'GET', {}, {}, true)
    Object.assign(this, data)
  }

  @action
  loadDataProviders = async () => {
    try {
      const { data } = await apiRequest(
        `/users/${this.id}/data-providers`,
        'GET',
        {},
        {},
        true
      )
      this.repositories = data.organisation.repositories
      this.selectedRepositoryId = this.repositories[0].id
    } catch (e) {
      if (e.status === 404) throw e
    }
  }

  @action
  loadUserPermissions = async () => {
    // if (!this.permissionsUrl) return
    // const permission = await apiRequest(this.permissionsUrl)
  }
}

export default User
