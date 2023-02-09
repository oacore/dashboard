import React, { useState } from 'react'

import MembershipPageTemplate from 'templates/membership'
import { withGlobalStore } from 'store'
import retrieveContent from 'content'

const ASSETS_BASE_URL = 'https://oacore.github.io/content/'

const MembershipPage = ({
  store: { dataProvider, organisation },
  ...props
}) => {
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
        value.description = value.description.replace(regex, dataProvider.id)
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

  return (
    <MembershipPageTemplate
      membershipPlan={organisation.billingPlan}
      {...props}
      {...stateData}
    />
  )
}

export default withGlobalStore(MembershipPage)
