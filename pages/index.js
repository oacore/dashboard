import { useEffect } from 'react'
import { withRouter } from 'next/router'

import Route from './_app/route'

import { withGlobalStore } from 'store'

const Index = ({ router, store }) => {
  useEffect(() => {
    const route = new Route({
      dataProvider: store.dataProvider.id,
      activity: store.activity.path,
    })
    router.push(route.href, route.as)
  })
  return null
}

export default withRouter(withGlobalStore(Index))
