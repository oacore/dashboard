import React, { useState } from 'react'

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
