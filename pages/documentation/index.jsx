import React from 'react'

import MembershipPageTemplate from 'templates/documentation/membership'
import retrieveContent from 'content'
// import {withGlobalStore} from "../../store";

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

export async function getStaticProps({ previewData }) {
  const ref = previewData?.ref
  const sections = await getSections({ ref })
  const data = {
    ...sections,
  }

  return {
    props: {
      data,
    },
  }
}

const MembershipPage = ({ data }) => <MembershipPageTemplate {...data} />

export default MembershipPage
