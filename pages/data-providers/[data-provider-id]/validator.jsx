import React from 'react'

import { withGlobalStore } from '../../../store'
import ValidatorPageTemplate from '../../../templates/validator'

const ValidatorPage = ({ ...props }) => (
  <ValidatorPageTemplate
    // issuesByType={dataProvider?.issues?.issuesByType}
    // errorsCount={dataProvider?.issues?.aggregation?.errorsCount}
    // warningCount={dataProvider?.issues?.aggregation?.warningsCount}
    {...props}
  />
)
export default withGlobalStore(ValidatorPage)
