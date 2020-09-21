import User from './base'

class DashboardUser extends User {
  static defaultValues = {
    ...User.defaultValues,
    dataProviders: [],
  }

  retrieve(...scopes) {
    return super.retrieve('dataProviders', ...scopes)
  }

  canManage(dataProviderId) {
    return (
      this.superAdmin ||
      this.dataProviders.some(({ id }) => Number(dataProviderId) === id)
    )
  }
}

export default DashboardUser
