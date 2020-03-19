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
    await apiRequest(`/works/${workId}`, {
      method: 'PATCH',
      body: { disabled: !isVisible },
    })

    const page = this.getPageByNumber(parseInt(pageNumber, 10))
    const row = page.data.find(r => r.originalId === workId)
    row.disabled = !row.disabled
  }
}

export default Works
