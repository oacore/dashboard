import User from './base'

class DashboardUser extends User {
  static defaultValues = {
    ...User.defaultValues,
    dataProviders: [],
    dataProvider: null,
  }

  retrieve(...scopes) {
    return super.retrieve('dataProviders', ...scopes)
  }

  canManage(dataProviderId) {
    return this.dataProviders.some(({ id }) => dataProviderId === id)
  }

  searchDataProviders(searchTerm) {
    return this.dataProviders.filter(
      (e) => e.name.toLowerCase().search(searchTerm.toLowerCase()) !== -1
    )
  }
}

export default DashboardUser
