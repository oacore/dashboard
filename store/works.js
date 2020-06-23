import { action } from 'mobx'

import { Pages } from './helpers/pages'

const { API_URL } = process.env

class Works extends Pages {
  constructor(baseUrl, options) {
    const url = `${baseUrl}/works`
    super(url, options)
    this.contentExportUrl = `${API_URL}${url}?accept=text/csv`
  }

  @action
  changeVisibility = async (rowId) => {
    const [, workId] = rowId.split('-', 2)
    const row = this.data.find((r) => r.originalId === workId)
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
