import React from 'react'

const DocumentationMembershipPageTemplate = ({ header }) => (
  <div>
    <p>{header.header1.title}</p>
    <p>{header.header1.caption}</p>
    <br />
    <p>{header.header2.title}</p>
    <p>{header.header2.caption}</p>
  </div>
)

export default DocumentationMembershipPageTemplate
