import React from 'react'

import TableCard from './cards/table-card'
import Title from '../../components/title'

const ContentTemplate = ({ works, changeVisibility, ...props }) => (
  <>
    <Title hidden>Content</Title>
    <TableCard works={works} changeVisibility={changeVisibility} {...props} />
  </>
)

export default ContentTemplate
