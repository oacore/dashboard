import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

import { GlobalContext } from '../store'

const RouteGuard = (WrappedComponent) => (props) => {
  const router = useRouter()
  const { ...globalStore } = useContext(GlobalContext)
  const [loading, setLoading] = useState(true)

  const disabledTabs = [
    'indexing',
    'deduplication',
    'content',
    'deposit-compliance',
    'doi',
    'rights-retention-strategy',
    'settings',
  ]

  useEffect(() => {
    const checkLastHarvestingDate = async () => {
      setLoading(true)
      try {
        const data = await globalStore.dataProvider.issues.getHarvestingStatus()
        if (
          data?.lastHarvestingDate === null &&
          disabledTabs.some((tab) => router.pathname.includes(tab))
        ) {
          const newPath = disabledTabs.reduce(
            (path, tab) =>
              path.includes(tab) ? path.replace(tab, 'overview') : path,
            router.asPath
          )
          router.replace(newPath)
        }
      } catch (error) {
        console.error('Error checking last harvesting date:', error)
      } finally {
        setLoading(false)
      }
    }
    checkLastHarvestingDate()
  }, [globalStore?.dataProvider?.issues])

  if (loading) return <div>Loading...</div>

  return <WrappedComponent {...props} />
}

export default RouteGuard
