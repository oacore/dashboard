import { action } from 'mobx'

import { Pages } from './helpers/pages'
import apiRequest from '../api'

class Works extends Pages {
  constructor(baseUrl) {
    const url = `${baseUrl}/works`
    super(url)
  }

  @action
  async changeVisibility(rowId) {
    const [pageNumber, workId] = rowId.split('-', 2)
    const page = this.getPageByNumber(parseInt(pageNumber, 10))
    const row = page.data.find(r => r.originalId === workId)
    const { disabled } = row
    row.disabled = !disabled
    try {
      await apiRequest(`/works/${workId}`, {
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
