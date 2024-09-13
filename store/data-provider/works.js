import { action, observable } from 'mobx'

import { Pages } from '../helpers/pages'
import Store from '../store'

class Works extends Store {
  baseStore = null

  @observable workRecords = null

  @action
  resetWorks() {
    this.workRecords = null
  }

  constructor(rootStore, baseUrl, options) {
    super(baseUrl, options)
    this.baseStore = rootStore
    this.updateWorks(baseUrl)
  }

  @action
  updateWorks = (baseUrl) => {
    const url = `${baseUrl}/works${
      this.baseStore?.setSelectedItem
        ? `?set=${this.baseStore?.setSelectedItem}`
        : ''
    }`
    this.workRecords = new Pages(url, this.options)
    this.contentExportUrl = `${process.env.API_URL}${url}?accept=text/csv`
  }

  @action
  changeVisibility = async (rowId) => {
    const [, workId] = rowId.split('-', 2)
    const row = this.workRecords.data.find((r) => r.originalId === +workId)
    const { disabled } = row
    row.disabled = !disabled
    try {
      await this.request(`/works/${workId}`, {
        method: 'PATCH',
        body: { disabled: !disabled },
      })
    } catch (e) {
      row.disabled = disabled
      throw e
    }
  }
}

export default Works
