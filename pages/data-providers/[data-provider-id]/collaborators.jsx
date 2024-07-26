import React from 'react'

import { withGlobalStore } from '../../../store'
import YourCollaboratorsPageTemplate from '../../../templates/your-collaborators'

const YourCollaboratorsPage = ({ store, ...props }) => (
  <YourCollaboratorsPageTemplate
    getFreshFindsData={store.dataProvider?.getFreshFindsData}
    freshFindsData={store.dataProvider?.freshFindsData}
    {...props}
  />
)

export default withGlobalStore(YourCollaboratorsPage)
