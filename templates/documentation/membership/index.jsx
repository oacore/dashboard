import React from 'react'

const DocumentationMembershipPageTemplate = ({ meta, header, instruction }) => (
  <>
    {meta.title}
    {meta.tagline}
    {header.title}
    {header.caption}
    {header.links}
    {instruction.recommended}
    {instruction.reminder.description}
  </>
)

export default DocumentationMembershipPageTemplate
