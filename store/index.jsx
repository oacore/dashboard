import React, { createContext, useContext, useEffect } from 'react'
import { useStaticRendering, observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import RootStore from './root'

const isServer = typeof window === 'undefined'
export const GlobalContext = createContext({})
let globalStore = null

useStaticRendering(isServer)

export const initStore = () => {
  // on the server-side a new instance is created for each page request
  // as we don't want to mix between users/requests, etc.
  if (isServer) return new RootStore()

  if (!globalStore) {
    globalStore = new RootStore()
    return globalStore
  }

  return globalStore
}

export const withGlobalStore = (Component) => {
  const ObservableComponent = observer(Component)
  return (props) => {
    const context = useContext(GlobalContext)
    return <ObservableComponent store={context} {...props} />
  }
}

export const GlobalProvider = ({ children, store }) => {
  const router = useRouter()

  useEffect(() => {
    if (router.asPath.includes('harvesting')) {
      const newIndexingPath = router.asPath.replace('harvesting', 'indexing')
      router.push(newIndexingPath)
    }
  }, [router.asPath, router])

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider
