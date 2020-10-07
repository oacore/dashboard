import { action, observable } from 'mobx'

import Store from './store'
import { Pages } from './helpers/pages'

class Issues extends Store {
  @observable harvestingStatus = null

  @observable aggregation = null

  @observable issuesByType = new Map()

  constructor(baseUrl, options) {
    super(baseUrl, options)

    this.issuesUrl = `${baseUrl}/issues`
    this.getHarvestingStatus()
    this.getIssuesAggregation()
  }

  @action
  async getHarvestingStatus() {
    const { data } = await this.request(`${this.url}/harvesting`)
    this.harvestingStatus = data
  }

  @action
  async getIssuesAggregation() {
    const { data } = await this.request(`${this.issuesUrl}/aggregation`)

    // initialize pages per every issue type
    Object.keys(data.countByType || {}).forEach((type) => {
      const pages = new Pages(this.issuesUrl, this.options)
      pages.type = type
      this.issuesByType.set(type, pages)
    })

    this.aggregation = data
  }
}

export default Issues
