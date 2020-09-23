import React from 'react'

import { withGlobalStore } from 'store'
import ContentTemplate from 'templates/content'

const Content = ({ store: { dataProvider }, ...props }) => (
  <ContentTemplate
    exportUrl={dataProvider?.works?.contentExportUrl}
    works={dataProvider?.works}
    changeVisibility={dataProvider?.works?.changeVisibility}
    {...props}
  />
)

export default withGlobalStore(Content)
