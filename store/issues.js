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
  async getHarvestingStatus(refresh = false) {
    try {
      let url = `${this.url}/harvesting`
      if (refresh) url += '?refresh=true'

      const options = refresh ? { cache: 'reload' } : {}

      const { data } = await this.request(url, options)
      this.harvestingStatus = data
      return data
    } catch (error) {
      console.error('Error fetching harvesting status:', error)
      this.harvestingStatus = null
      throw error
    }
  }

  @action
  async getIssuesAggregation() {
    try {
      const { data } = await this.request(`${this.issuesUrl}/aggregation`)

      // initialize pages per every issue type
      Object.keys(data.countByType || {}).forEach((type) => {
        const downloadUrl = `${process.env.API_URL}${this.issuesUrl}?type=${type}&accept=text/csv`
        const pages = new Pages(this.issuesUrl, this.options)
        pages.type = type
        pages.downloadUrl = downloadUrl
        this.issuesByType.set(type, pages)
      })

      this.aggregation = data
    } catch (error) {
      console.error('Error fetching issues aggregation:', error)
      this.aggregation = null
    }
  }
}

export default Issues
