import { createElement } from 'react'

import body, { title, effectiveFromDate } from './terms.mdx'

class Template {
  constructor(component) {
    this.component = component
  }

  render(context) {
    return createElement(this.component, context ?? {}, null)
  }
}

const terms = {
  title,
  effectiveFromDate: new Date(effectiveFromDate),
  body: new Template(body),
}

export default { terms }
