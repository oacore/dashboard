import React from 'react'

import TableCard from './cards/table-card'
import Title from '../../components/title'

const ContentTemplate = ({ works, changeVisibility, exportUrl, ...props }) => (
  <>
    <Title hidden>Content</Title>
    {works && (
      <TableCard
        works={works}
        changeVisibility={changeVisibility}
        exportUrl={exportUrl}
        {...props}
      />
    )}
  </>
)

export default ContentTemplate
