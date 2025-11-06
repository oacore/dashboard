import React, { useState } from 'react'

import DocumentationPageTemplate from '../../../templates/membership/documentation'

import { withGlobalStore } from 'store'
import retrieveContent from 'content'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const DocumentationPage = ({ store: { dataProvider }, ...props }) => {
  const [stateData, setStateData] = useState({})
  const [dataProviderDocs, setDataProviderDocs] = useState(null)

  const setAssetsUrl = (object) => {
    Object.entries(object).forEach(([, value]) => {
      if (value.images) {
        Object.entries(value.images).forEach(([, item]) => {
          item.file = ASSETS_BASE_URL + item.file
        })
      }
      if (value.descriptionDashboard) {
        const regex = /({{\w+}})/g
        value.descriptionDashboard = value.descriptionDashboard.replace(
          regex,
          dataProvider.id
        )
      }
    })
  }

  const getSections = async ({ ref } = {}) => {
    const content = await retrieveContent('docs-membership', {
      ref,
      transform: 'object',
    })
    // Remove header for About repo
    delete content.headerAbout
    Object.values(content).forEach((section) => {
      if (section.items) setAssetsUrl(section.items)
    })

    return content
  }

  const getDataProviderSections = async ({ ref } = {}) => {
    const content = await retrieveContent('docs-dataProvider', {
      ref,
      transform: 'object',
    })
    // Remove header for About repo
    delete content.headerAbout
    Object.values(content).forEach((section) => {
      if (section.items) setAssetsUrl(section.items)
    })

    return content
  }

  if (Object.getOwnPropertyNames(stateData).length === 0) {
    // Load both content types
    Promise.all([getSections(), getDataProviderSections()]).then(
      ([membershipContent, dataProviderContent]) => {
        setStateData(membershipContent)
        setDataProviderDocs(dataProviderContent)
      }
    )
    return <></>
  }

  return (
    <DocumentationPageTemplate
      membershipPlan={dataProvider.membershipPlan}
      dataProviderDocs={dataProviderDocs}
      {...props}
      {...stateData}
    />
  )
}

export default withGlobalStore(DocumentationPage)
