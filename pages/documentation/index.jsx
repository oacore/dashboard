import React, { useState } from 'react'

import DocumentationMembershipPageTemplate from 'templates/documentation/membership'
import retrieveContent from 'content'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const setAssetsUrl = (object) =>
  Object.entries(object).forEach(([, value]) => {
    if (value.images) {
      Object.entries(value.images).forEach(([, item]) => {
        item.file = ASSETS_BASE_URL + item.file
      })
    }
  })

const getSections = async ({ ref } = {}) => {
  const content = await retrieveContent('docs-membership', {
    ref,
    transform: 'object',
  })

  Object.values(content).forEach((section) => {
    if (section.items) setAssetsUrl(section.items)
  })

  return content
}

const MembershipDocumentationPage = () => {
  const [stateData, setStateData] = useState({})

  if (Object.getOwnPropertyNames(stateData).length === 0) {
    getSections().then((val) => {
      setStateData(val)
    })
    return <></>
  }

  return <DocumentationMembershipPageTemplate {...stateData} />
}

export default MembershipDocumentationPage
