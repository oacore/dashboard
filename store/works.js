import { action } from 'mobx'

import { Pages } from './helpers/pages'

class Works extends Pages {
  constructor(baseUrl, options) {
    const url = `${baseUrl}/works`
    super(url, options)
  }

  @action
  async changeVisibility(rowId) {
    const [pageNumber, workId] = rowId.split('-', 2)
    const page = this.getPageByNumber(parseInt(pageNumber, 10))
    const row = page.data.find(r => r.originalId === workId)
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
