import React from 'react'

import TableCard from './cards/table-card'

const ContentTemplate = ({ works, changeVisibility, ...props }) => (
  <TableCard works={works} changeVisibility={changeVisibility} {...props} />
)

export default ContentTemplate
