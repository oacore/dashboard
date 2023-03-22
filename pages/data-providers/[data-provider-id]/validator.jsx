import React from 'react'

import ValidatorPageTemplate from '../../../templates/validator'

import { withGlobalStore } from 'store'

const ValidatorPage = ({ store, ...props }) => (
  <ValidatorPageTemplate
    rioxValidation={store.dataProvider.rioxValidation}
    repositoryValidator={store.dataProvider.repositoryValidator}
    validationResult={store.dataProvider.validationResult}
    handleTextareaChange={store.dataProvider.handleTextareaChange}
    recordValue={store.dataProvider.recordValue}
    rioxxCompliance={store.dataProvider?.rioxx}
    {...props}
  />
)
export default withGlobalStore(ValidatorPage)
