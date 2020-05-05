import React from 'react'

import { useRedirect } from '../_app/hooks'

import { withGlobalStore } from 'store'
import { Card } from 'design'

const AccessError = () => (
  <Card>
    <h1>
      Access error{' '}
      <span role="img" aria-label="sadly">
        😞
      </span>
    </h1>
    <p>There is no repository or journal you have access to.</p>
  </Card>
)

// It's not a real list. It's a redirect at the moment
const DataProviders = ({ store }) => {
  const { dataProviders } = store
  const id = dataProviders && dataProviders[0].id

  useRedirect(id && '[data-provider-id]', `${id}`)

  return id == null ? <AccessError /> : null
}

export default withGlobalStore(DataProviders)
