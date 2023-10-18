import React, { useState } from 'react'

import BadgesPageTemplate from '../../../templates/settings/badges'
import retrieveContent from '../../../content'

import { withGlobalStore } from 'store'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'
const BadgesPage = ({ store, ...restProps }) => {
  const [stateData, setStateData] = useState({})

  const setAssetsUrl = (object) => {
    Object.entries(object).forEach(([, value]) => {
      if (value.images) {
        Object.entries(value.images).forEach(([, item]) => {
          item.file = ASSETS_BASE_URL + item.file
        })
      }
      if (value.descriptionDashboard) {
        const regex = /({{\w+}})/g
        value.descriptionDashboard = value.descriptionDashboard.replace(regex)
      }
    })
  }

  const getSections = async ({ ref } = {}) => {
    const content = await retrieveContent('docs-membership', {
      ref,
      transform: 'object',
    })
    delete content.headerAbout
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
  return <BadgesPageTemplate stateData={stateData} {...restProps} />
}
export default withGlobalStore(BadgesPage)
