import React from 'react'

import { withGlobalStore } from '../../../store'
import ValidatorPageTemplate from '../../../templates/validator'

const ValidatorPage = ({ store, ...props }) => (
  <ValidatorPageTemplate
    rioxValidation={store.rioxValidation}
    repositoryValidator={store.repositoryValidator}
    validationResult={store.validationResult}
    handleTextareaChange={store.handleTextareaChange}
    recordValue={store.recordValue}
    {...props}
  />
)
export default withGlobalStore(ValidatorPage)
