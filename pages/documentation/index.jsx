import React from 'react'

import DocumentationMembershipPageTemplate from 'templates/documentation/membership'
import retrieveContent from 'content'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const setAssetsUrl = (object) =>
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes('/images'))
      object[key] = ASSETS_BASE_URL + value
  })

const getSections = async ({ ref } = {}) => {
  const content = await retrieveContent('dataset', {
    ref,
    transform: 'object',
  })

  Object.values(content).forEach((section) => {
    setAssetsUrl(section)
    if (section.box) setAssetsUrl(section.box)
  })

  return content
}

const MembershipDocumentationPage = () => {
  let data = []

  data = getSections()

  // eslint-disable-next-line no-console
  console.log(data)

  return <DocumentationMembershipPageTemplate {...data} />
}

export default MembershipDocumentationPage
// export default withGlobalStore(MembershipDocumentationPage)
