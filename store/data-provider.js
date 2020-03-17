import Resource from './resource'

class DataProvider extends Resource {
  static defaultValues = {
    name: null,
    email: null,
    statistics: {},
    plugins: {},
  }

  init(...args) {
    super.init(...args)
    if (this.options.prefetch) return this.retrieve(['statistics', 'plugins'])
    return Promise.resolve()
  }
}

export default DataProvider
