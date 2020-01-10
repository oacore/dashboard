import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { withGlobalStore } from 'store'

const Index = ({ store }) => {
  const router = useRouter()

  useEffect(() => {
    if (!store.user.organisationId) return
    const pathname = '/data-providers/[data-provider-id]'
    const asPath = `/data-providers/${store.user.organisationId}`
    router.replace(pathname, asPath)
  }, [store.user.organisationId])

  return null
}

export default withGlobalStore(Index)
