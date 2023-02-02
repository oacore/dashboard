import React, { useState } from 'react'

import DocumentationMembershipPageTemplate from 'templates/documentation/membership'
import retrieveContent from 'content'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const MembershipDocumentationPage = ({ dataProviderId }) => {
  const [stateData, setStateData] = useState({})

  const setAssetsUrl = (object) => {
    Object.entries(object).forEach(([, value]) => {
      if (value.images) {
        Object.entries(value.images).forEach(([, item]) => {
          item.file = ASSETS_BASE_URL + item.file
        })
      }
      if (value.description) {
        const regex = /({{\w+}})/g
        value.description = value.description.replace(regex, dataProviderId)
      }
    })
  }

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
  if (Object.getOwnPropertyNames(stateData).length === 0) {
    getSections().then((val) => {
      setStateData(val)
    })
    return <></>
  }

  return <DocumentationMembershipPageTemplate {...stateData} />
}

export default MembershipDocumentationPage
