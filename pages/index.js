import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { withGlobalStore } from 'store'

const Index = ({ store }) => {
  const router = useRouter()

  useEffect(() => {
    const pathname = '/data-providers/[data-provider-id]'
    const asPath = `/data-providers/${store.user.firstRepositoryId}`
    router.replace(pathname, asPath)
  }, [])

  return null
}

export default withGlobalStore(Index)
