import { action, observable } from 'mobx'

import Store from './store'
import { Pages } from './helpers/pages'

class Issues extends Store {
  @observable harvestingStatus = null

  @observable aggregation = null

  @observable issues = null

  constructor(baseUrl, options) {
    super(baseUrl, options)

    this.issuesUrl = `${baseUrl}/issues`
    this.issues = new Pages(this.issuesUrl, this.options)
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
    this.aggregation = data
  }
}

export default Issues
