import { action, observable } from 'mobx'

import { Pages } from './helpers/pages'
import Store from './store'

import { NotFoundError } from 'api/errors'

const { API_URL } = process.env

class DOI extends Store {
  @observable isExportDisabled = false

  @observable doiCount = 0

  @observable doiRecords = null

  constructor(baseUrl, options) {
    super(baseUrl, options)
    const doiUrl = `${baseUrl}/doi`
    this.doiRecords = new Pages(doiUrl)
    this.doiUrl = `${API_URL}${doiUrl}?accept=text/csv`

    this.loadDOICount()
  }

  @action
  loadDOICount = async () => {
    try {
      this.isExportDisabled = false
      const { headers } = await this.request(this.doiUrl, { method: 'HEAD' })
      const length = headers.get('Collection-Length')
      this.doiCount = Number.parseInt(length, 10) || null
    } catch (error) {
      if (error instanceof NotFoundError) this.isExportDisabled = true
      else throw error
    }
  }
}

export default DOI
