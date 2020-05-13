import React from 'react'

import { withGlobalStore } from 'store'
import ContentTemplate from 'templates/content'

const Content = ({ store, ...props }) => (
  <ContentTemplate
    works={store.works}
    changeVisibility={store.works.changeVisibility}
    {...props}
  />
)

export default withGlobalStore(Content)
